# BlueChat - Complete File Structure

## Project Organization

```
bluechat-monorepo/
│
├── 📖 Documentation
│   ├── README.md                    # Main project documentation
│   ├── QUICKSTART.md                # Get started in 5 minutes
│   ├── DEPLOYMENT.md                # Production deployment guide
│   ├── FILE_STRUCTURE.md            # This file
│   └── .gitignore
│
├── 🎨 Frontend (React + Tailwind)
│   ├── package.json                 # Frontend dependencies
│   ├── Dockerfile                   # Docker image for frontend
│   ├── tsconfig.json                # TypeScript configuration
│   ├── vite.config.js               # Vite build configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── index.html                   # HTML entry point
│   │
│   └── src/
│       ├── App.jsx                  # Root component
│       ├── main.jsx                 # Vite entry point
│       ├── index.css                # Global styles
│       │
│       ├── components/              # Reusable UI components
│       │   ├── ChatWindow.jsx       # Main chat interface
│       │   ├── Sidebar.jsx          # Contact list sidebar
│       │   ├── MessageBubble.jsx    # Message component
│       │   ├── UserProfile.jsx      # User profile card
│       │   ├── TypingIndicator.jsx  # Typing animation
│       │   └── Modal.jsx            # Reusable modal
│       │
│       ├── pages/                   # Full page components
│       │   ├── LoginPage.jsx        # Login screen
│       │   ├── RegisterPage.jsx     # Registration screen
│       │   ├── ChatPage.jsx         # Main chat page
│       │   └── SettingsPage.jsx     # Settings/preferences
│       │
│       ├── services/                # API & WebSocket services
│       │   ├── api.js               # Axios API client
│       │   ├── socket.js            # Socket.io client
│       │   └── auth.js              # Authentication service
│       │
│       ├── hooks/                   # Custom React hooks
│       │   ├── useAuth.js           # Authentication hook
│       │   ├── useChat.js           # Chat state hook
│       │   └── useWebSocket.js      # WebSocket connection hook
│       │
│       ├── context/                 # React Context
│       │   ├── AuthContext.jsx      # Auth state provider
│       │   └── ThemeContext.jsx     # Dark/light mode
│       │
│       └── utils/                   # Helper functions
│           ├── dateFormat.js        # Date formatting
│           ├── validators.js        # Input validation
│           └── constants.js         # App constants
│
├── 🖥️  Backend (Node.js + Express)
│   ├── package.json                 # Backend dependencies
│   ├── .env.example                 # Environment variables template
│   ├── Dockerfile                   # Docker image for backend
│   ├── .dockerignore                # Docker ignore patterns
│   │
│   └── src/
│       ├── server.js                # Express app & Socket.io setup
│       │
│       ├── routes/                  # API endpoint handlers
│       │   ├── auth.js              # /auth/* endpoints
│       │   ├── users.js             # /users/* endpoints
│       │   ├── chats.js             # /chats/* endpoints
│       │   ├── messages.js          # /messages/* endpoints
│       │   ├── groups.js            # /groups/* endpoints
│       │   └── files.js             # /files/* endpoints
│       │
│       ├── models/                  # MongoDB Mongoose schemas
│       │   └── index.js             # User, Chat, Message, Group, File
│       │
│       ├── controllers/             # Business logic
│       │   ├── authController.js    # Authentication logic
│       │   ├── userController.js    # User operations
│       │   ├── chatController.js    # Chat operations
│       │   └── messageController.js # Message operations
│       │
│       ├── middleware/              # Express middleware
│       │   ├── auth.js              # JWT verification
│       │   ├── validation.js        # Input validation
│       │   ├── errorHandler.js      # Error handling
│       │   └── rateLimit.js         # Rate limiting
│       │
│       ├── services/                # External services
│       │   ├── emailService.js      # Email sending
│       │   ├── storageService.js    # S3 file storage
│       │   └── cacheService.js      # Redis caching
│       │
│       ├── websocket/               # Socket.io handlers
│       │   ├── messageHandler.js    # Message events
│       │   ├── typingHandler.js     # Typing indicators
│       │   └── statusHandler.js     # User status updates
│       │
│       ├── config/                  # Configuration files
│       │   ├── database.js          # Database connection
│       │   ├── cors.js              # CORS configuration
│       │   └── security.js          # Security settings
│       │
│       └── utils/                   # Helper functions
│           ├── logger.js            # Logging utility
│           ├── jwt.js               # JWT utilities
│           └── encryption.js        # Data encryption
│
├── 📚 API Documentation
│   ├── docs/
│   │   ├── endpoints.md             # Complete API endpoint docs
│   │   ├── openapi.yaml             # OpenAPI/Swagger spec
│   │   └── examples.md              # Code examples
│   │
│   └── schemas/                     # JSON schemas
│       ├── user.json                # User schema
│       ├── message.json             # Message schema
│       └── error.json               # Error response schema
│
├── 🐳 Docker & Deployment
│   ├── docker-compose.yml           # Multi-container orchestration
│   ├── Dockerfile                   # Root Dockerfile (if needed)
│   │
│   ├── nginx/                       # Reverse proxy config
│   │   └── nginx.conf               # Nginx configuration
│   │
│   └── scripts/                     # Utility scripts
│       ├── init-mongodb.js          # MongoDB initialization
│       ├── seed.js                  # Seed demo data
│       └── backup.sh                # Database backup script
│
└── 📋 Configuration & Scripts
    ├── package.json                 # Root package.json (optional)
    ├── .github/                     # GitHub configuration
    │   └── workflows/
    │       └── ci-cd.yml            # GitHub Actions pipeline
    ├── .env.production              # Production environment vars
    ├── ecosystem.config.js          # PM2 configuration
    └── docker-compose.prod.yml      # Production Compose file
```

---

## Key Directories Explained

### Frontend (`/frontend`)
- React application using Vite for fast development
- Tailwind CSS for styling
- Socket.io client for real-time updates
- Axios for API requests
- Features: auth, chat, groups, file upload, dark mode

### Backend (`/backend`)
- Express.js REST API with `/api/v1/*` prefix
- MongoDB database with Mongoose ORM
- Socket.io for WebSocket communication
- JWT authentication with refresh tokens
- File upload with AWS S3 support
- Rate limiting and input validation
- Email notifications via SMTP

### API (`/api`)
- OpenAPI/Swagger specification
- Complete endpoint documentation
- JSON schemas for request/response validation
- Usage examples and code snippets

### Docker
- `docker-compose.yml` - Full stack (MongoDB, Redis, Backend, Frontend, Nginx)
- Individual Dockerfiles for backend and frontend
- Nginx reverse proxy configuration
- Health checks and automatic restarts

---

## Important Files to Customize

### 1. Backend Environment (`.env`)
```bash
cp backend/.env.example backend/.env
# Edit these key variables:
# - DATABASE_URL: Your MongoDB connection
# - JWT_SECRET: Generate secure random string
# - FRONTEND_URL: Your domain
# - AWS credentials for file storage
# - SMTP settings for email
```

### 2. Frontend Environment (`.env.local`)
```bash
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=ws://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_id
```

### 3. Docker Compose (for production)
```yaml
# Update:
# - Environment variables
# - Port bindings
# - Volume paths
# - Network configuration
```

### 4. Nginx Configuration
```
# Update server_name, SSL certificates, proxy passes
# See nginx/nginx.conf for template
```

---

## Database Models

### User
- username, email, password (hashed)
- profile: avatar, bio, firstName, lastName
- status: online/away/offline/dnd
- preferences: theme, notifications, privacy

### Chat (Direct Messages)
- participants: array of user IDs
- lastMessage, lastMessageAt
- isArchived flag

### Message
- chatId, senderId, content
- fileId (optional attachment)
- reactions: array of emojis with users
- readBy: array of read receipts
- timestamps: createdAt, editedAt, deletedAt

### Group
- name, description, avatar
- owner, members with roles (admin/mod/member)
- settings: public, allowReactions, allowFileSharing
- lastMessage, lastMessageAt

### File
- originalName, filename, mimeType, size
- uploadedBy userId
- s3Key for AWS storage
- url to access the file
- associated chatId or groupId

---

## API Endpoints Summary

### Authentication
- `POST /auth/register` - Create account
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - Logout

### Users
- `GET /users/me` - Current user
- `GET /users/:id` - Get user
- `PUT /users/:id` - Update user
- `GET /users/search` - Search users

### Chats
- `GET /chats` - List chats
- `POST /chats` - Create chat
- `GET /chats/:id` - Get chat
- `DELETE /chats/:id` - Delete chat

### Messages
- `GET /messages/chat/:chatId` - Get messages
- `POST /messages` - Send message
- `PUT /messages/:id` - Edit message
- `DELETE /messages/:id` - Delete message
- `POST /messages/:id/reaction` - Add reaction

### Groups
- `GET /groups` - List groups
- `POST /groups` - Create group
- `PUT /groups/:id` - Update group
- `POST /groups/:id/members` - Add member
- `DELETE /groups/:id/members/:userId` - Remove member

### Files
- `POST /files` - Upload file
- `GET /files/:id` - Get file info
- `DELETE /files/:id` - Delete file

---

## WebSocket Events

### Client → Server
- `user_join` - User enters chat
- `typing` - User is typing
- `new_message` - Send message
- `message_read` - Mark message as read
- `add_reaction` - React to message

### Server → Client
- `message_received` - New message
- `user_typing` - User typing indicator
- `user_joined` - User joined chat
- `message_read_receipt` - Message read
- `reaction_added` - Reaction added

---

## Development Workflow

1. **Frontend changes**: `cd frontend && npm run dev`
2. **Backend changes**: `cd backend && npm run dev`
3. **Database changes**: Modify models in `backend/src/models/index.js`
4. **API changes**: Create routes in `backend/src/routes/`
5. **Testing**: Run `npm test` in each directory

---

## Deployment Checklist

- [ ] Update all `.env` variables with production values
- [ ] Generate secure JWT secrets
- [ ] Configure MongoDB Atlas or self-hosted
- [ ] Set up AWS S3 bucket for file storage
- [ ] Configure SMTP for email notifications
- [ ] Set up SSL certificates (Let's Encrypt)
- [ ] Configure Nginx reverse proxy
- [ ] Set up monitoring and logging
- [ ] Configure backups and disaster recovery
- [ ] Run security audit
- [ ] Load test the application
- [ ] Set up CI/CD pipeline

---

## Getting Help

- **Quick Start**: See [QUICKSTART.md](./QUICKSTART.md)
- **Full Docs**: See [README.md](./README.md)
- **Deployment**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **API Reference**: See [api/docs/endpoints.md](./api/docs/endpoints.md)
- **Issues**: Open GitHub issue or email support@bluechat.app

---

**Last Updated**: January 2024
**Version**: 1.0.0
