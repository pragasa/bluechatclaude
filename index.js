// Database Models - Mongoose Schemas

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User Model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: String,
  lastName: String,
  avatar: String,
  bio: String,
  status: {
    type: String,
    enum: ['online', 'away', 'offline', 'dnd'],
    default: 'offline'
  },
  lastSeen: Date,
  theme: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'system'
  },
  notifications: {
    enabled: { type: Boolean, default: true },
    sound: { type: Boolean, default: true },
    desktop: { type: Boolean, default: true }
  },
  privacy: {
    showOnlineStatus: { type: Boolean, default: true },
    allowMessageReactions: { type: Boolean, default: true },
    allowGroupInvites: { type: Boolean, default: true }
  },
  googleId: String,
  githubId: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Chat Model (Direct messages)
const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Message Model
const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  },
  reactions: [{
    emoji: String,
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: Date
  }],
  editedAt: Date,
  deletedAt: Date,
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Group Model
const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  avatar: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'member'],
      default: 'member'
    },
    joinedAt: { type: Date, default: Date.now }
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  settings: {
    isPublic: { type: Boolean, default: false },
    allowReactions: { type: Boolean, default: true },
    allowFileSharing: { type: Boolean, default: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// File Model
const fileSchema = new mongoose.Schema({
  originalName: String,
  filename: String,
  mimeType: String,
  size: Number,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  s3Key: String,
  url: String,
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: false });

// Create indices for performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
chatSchema.index({ participants: 1 });
messageSchema.index({ chatId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });
groupSchema.index({ owner: 1 });
fileSchema.index({ uploadedBy: 1 });
fileSchema.index({ chatId: 1 });

// Export models
const User = mongoose.model('User', userSchema);
const Chat = mongoose.model('Chat', chatSchema);
const Message = mongoose.model('Message', messageSchema);
const Group = mongoose.model('Group', groupSchema);
const File = mongoose.model('File', fileSchema);

module.exports = {
  User,
  Chat,
  Message,
  Group,
  File,
  schemas: {
    userSchema,
    chatSchema,
    messageSchema,
    groupSchema,
    fileSchema
  }
};
