// Message Routes
// GET /api/v1/messages/chat/:chatId - Get chat messages
// POST /api/v1/messages - Create new message
// PUT /api/v1/messages/:id - Edit message
// DELETE /api/v1/messages/:id - Delete message
// POST /api/v1/messages/:id/reaction - Add reaction to message
// DELETE /api/v1/messages/:id/reaction/:emoji - Remove reaction

const express = require('express');
const router = express.Router();
const { Message, Chat, Group, User } = require('./index');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get chat messages with pagination
router.get('/chat/:chatId', verifyToken, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    // Verify user is part of chat
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(req.userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const messages = await Message.find({ chatId })
      .populate('senderId', 'username avatar firstName lastName')
      .populate('fileId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({ chatId });

    res.json({
      messages: messages.reverse(),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
});

// Create new message
router.post('/', verifyToken, async (req, res) => {
  try {
    const { chatId, content, fileId } = req.body;

    if (!chatId || !content.trim()) {
      return res.status(400).json({ error: 'Chat ID and content are required' });
    }

    // Verify user is part of chat
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.participants.includes(req.userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const message = new Message({
      chatId,
      senderId: req.userId,
      content: content.trim(),
      fileId
    });

    await message.save();
    await message.populate('senderId', 'username avatar firstName lastName');

    // Update chat's last message
    chat.lastMessage = message._id;
    chat.lastMessageAt = new Date();
    await chat.save();

    res.status(201).json({
      message: 'Message created',
      data: message
    });

  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

// Edit message
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Verify user is sender
    if (message.senderId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Can only edit your own messages' });
    }

    if (!content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }

    message.content = content.trim();
    message.editedAt = new Date();
    await message.save();

    res.json({
      message: 'Message updated',
      data: message
    });

  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// Delete message
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Verify user is sender or chat admin
    if (message.senderId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Can only delete your own messages' });
    }

    message.deletedAt = new Date();
    message.content = '[deleted]';
    await message.save();

    res.json({
      message: 'Message deleted',
      data: message
    });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Add reaction to message
router.post('/:id/reaction', verifyToken, async (req, res) => {
  try {
    const { emoji } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Find or create reaction
    let reaction = message.reactions.find(r => r.emoji === emoji);
    
    if (!reaction) {
      message.reactions.push({
        emoji,
        users: [req.userId]
      });
    } else {
      // Add user if not already reacted
      if (!reaction.users.includes(req.userId)) {
        reaction.users.push(req.userId);
      }
    }

    await message.save();

    res.json({
      message: 'Reaction added',
      data: message
    });

  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({ error: 'Failed to add reaction' });
  }
});

// Remove reaction from message
router.delete('/:id/reaction/:emoji', verifyToken, async (req, res) => {
  try {
    const { emoji } = req.params;
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const reaction = message.reactions.find(r => r.emoji === emoji);
    if (reaction) {
      reaction.users = reaction.users.filter(u => u.toString() !== req.userId);
      
      // Remove reaction if no users left
      if (reaction.users.length === 0) {
        message.reactions = message.reactions.filter(r => r.emoji !== emoji);
      }
    }

    await message.save();

    res.json({
      message: 'Reaction removed',
      data: message
    });

  } catch (error) {
    console.error('Remove reaction error:', error);
    res.status(500).json({ error: 'Failed to remove reaction' });
  }
});

// Mark messages as read
router.post('/batch/read', verifyToken, async (req, res) => {
  try {
    const { messageIds } = req.body;

    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({ error: 'Message IDs array is required' });
    }

    await Message.updateMany(
      { _id: { $in: messageIds } },
      {
        $push: {
          readBy: {
            userId: req.userId,
            readAt: new Date()
          }
        }
      }
    );

    res.json({
      message: 'Messages marked as read'
    });

  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

// Search messages in a chat
router.get('/chat/:chatId/search', verifyToken, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const messages = await Message.find({
      chatId,
      content: { $regex: q, $options: 'i' }
    })
    .populate('senderId', 'username avatar')
    .sort({ createdAt: -1 })
    .limit(50);

    res.json({
      results: messages
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
