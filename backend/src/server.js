// BlueChat Backend Server
// Main Express.js + Socket.io application entry point

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Database connection
mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/bluechat', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection failed:', err));

// Import routes. Some route modules are not present in this trimmed checkout yet,
// so missing routes return a clear response instead of preventing startup.
const notImplementedRoute = (name) => {
  const router = express.Router();
  router.use((req, res) => {
    res.status(501).json({ error: `${name} routes are not implemented in this checkout` });
  });
  return router;
};

const loadRoute = (path, name) => {
  try {
    return require(path);
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      throw error;
    }
    console.warn(`Route module missing: ${path}`);
    return notImplementedRoute(name);
  }
};

const authRoutes = loadRoute('./routes/auth', 'auth');
const userRoutes = loadRoute('./routes/users', 'users');
const chatRoutes = loadRoute('./routes/chats', 'chats');
const messageRoutes = loadRoute('./routes/messages', 'messages');
const groupRoutes = loadRoute('./routes/groups', 'groups');
const fileRoutes = loadRoute('./routes/files', 'files');

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/chats', chatRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/groups', groupRoutes);
app.use('/api/v1/files', fileRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    name: 'BlueChat API',
    version: '1.0.0',
    documentation: 'See /api/docs/swagger for OpenAPI spec'
  });
});

// WebSocket handlers
const userSockets = new Map();
const typingUsers = new Map();

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // User joins
  socket.on('user_join', (data) => {
    const { userId, chatId } = data;
    userSockets.set(userId, socket.id);
    socket.join(`chat_${chatId}`);
    socket.broadcast.to(`chat_${chatId}`).emit('user_joined', { userId, timestamp: new Date() });
  });

  // User typing
  socket.on('typing', (data) => {
    const { chatId, userId, isTyping } = data;
    if (isTyping) {
      typingUsers.set(userId, true);
    } else {
      typingUsers.delete(userId);
    }
    socket.broadcast.to(`chat_${chatId}`).emit('user_typing', { userId, isTyping });
  });

  // New message
  socket.on('new_message', (data) => {
    const { chatId, message } = data;
    const msgData = {
      ...message,
      timestamp: new Date(),
      id: `msg_${Date.now()}`
    };
    io.to(`chat_${chatId}`).emit('message_received', msgData);
  });

  // Read receipt
  socket.on('message_read', (data) => {
    const { chatId, messageId, userId } = data;
    io.to(`chat_${chatId}`).emit('message_read_receipt', { messageId, userId, timestamp: new Date() });
  });

  // Message reaction
  socket.on('add_reaction', (data) => {
    const { chatId, messageId, emoji, userId } = data;
    io.to(`chat_${chatId}`).emit('reaction_added', { messageId, emoji, userId });
  });

  // Call initiated
  socket.on('call_initiated', (data) => {
    const { targetUserId, callData } = data;
    const targetSocket = userSockets.get(targetUserId);
    if (targetSocket) {
      io.to(targetSocket).emit('incoming_call', callData);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
    userSockets.forEach((value, key) => {
      if (value === socket.id) {
        userSockets.delete(key);
        typingUsers.delete(key);
      }
    });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({
    error: {
      status,
      message,
      timestamp: new Date().toISOString()
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      status: 404,
      message: 'Endpoint not found'
    }
  });
});

// Server startup
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║        🔵 BlueChat Server Started 🔵     ║
╚══════════════════════════════════════════╝
📡 Server: http://localhost:${PORT}
🔌 WebSocket: ws://localhost:${PORT}
📚 API Docs: http://localhost:${PORT}/api/docs
💾 Database: ${process.env.DATABASE_URL || 'mongodb://localhost:27017/bluechat'}
🌍 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = { app, server, io };
