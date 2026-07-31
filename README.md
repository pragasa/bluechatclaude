# BlueChat - Full Stack Chat Application

A professional, scalable chat application with real-time messaging, groups, file sharing, and more. Built with React, Node.js/Express, MongoDB, and WebSockets.

## 📋 Project Structure

```
bluechat-monorepo/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API and WebSocket services
│   │   ├── hooks/           # Custom React hooks
│   │   ├── styles/          # Global and component styles
│   │   ├── utils/           # Helper functions
│   │   ├── context/         # React Context for state
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                 # Express.js server
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── models/          # Database models
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── services/        # External services (email, storage)
│   │   ├── websocket/       # WebSocket handlers
│   │   ├── utils/           # Helper functions
│   │   ├── config/          # Configuration files
│   │   └── server.js        # Express app setup
│   ├── .env.example
│   ├── package.json
│   └── docker/              # Docker setup
│
├── api/                     # API documentation
│   ├── docs/
│   │   ├── openapi.yaml    # OpenAPI/Swagger spec
│   │   └── endpoints.md    # Endpoint documentation
│   └── schemas/            # JSON schemas
│
├── docker-compose.yml
├── .gitignore
└── DEPLOYMENT.md
```

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js 18+
- MongoDB or PostgreSQL
- npm or yarn

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your database credentials
npm run dev
```
Server runs on http://localhost:3000

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment instructions including Docker, AWS, and Heroku options.

## 🎯 Core Features

- **Real-time Messaging**: WebSocket-based instant message delivery
- **User Authentication**: JWT-based auth with OAuth support (Google, GitHub)
- **Direct & Group Chats**: Private and group conversations
- **Typing Indicators**: See when others are typing
- **Read Receipts**: Know when messages are read
- **Message Reactions**: Emoji reactions to messages
- **File Sharing**: Upload images, documents, and media
- **Chat History**: Searchable message archives
- **User Profiles**: Customizable avatars, status, bios
- **Dark/Light Mode**: System theme preference support
- **Notifications**: Desktop and in-app notifications
- **Admin Controls**: Group moderation and settings
- **Security**: End-to-end encryption ready, rate limiting, input validation

## 🔧 Tech Stack

**Frontend**
- React 18 with Vite
- Tailwind CSS for styling
- Socket.io client for WebSocket
- Context API for state management
- React Router for navigation

**Backend**
- Node.js + Express.js
- MongoDB (primary) or PostgreSQL
- Socket.io for real-time communication
- JWT for authentication
- Multer for file uploads
- Mongoose/Sequelize for ORM

**DevOps**
- Docker & Docker Compose
- GitHub Actions CI/CD
- Nginx reverse proxy
- PM2 for process management

## 📚 API Documentation

All endpoints follow REST conventions with `/api/v1/` prefix. Full OpenAPI spec available in `api/docs/openapi.yaml`.

Key endpoint categories:
- `/auth/` - Authentication
- `/users/` - User management
- `/chats/` - Chat operations
- `/messages/` - Message CRUD
- `/groups/` - Group management
- `/files/` - File uploads

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Rate limiting on all endpoints
- CORS configuration
- Input validation with Joi
- SQL injection prevention
- XSS protection headers
- CSRF token validation
- Secure session management

## 📊 Database Schema

See `backend/src/models/` for detailed schemas:
- Users
- Chats
- Messages
- Groups
- Files
- ReadReceipts

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## 📝 Environment Variables

### Backend (.env)
```
NODE_ENV=production
PORT=3000
DATABASE_URL=mongodb://user:pass@localhost:27017/bluechat
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=7d
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
REDIS_URL=redis://localhost:6379
AWS_S3_BUCKET=bluechat-files
AWS_REGION=us-east-1
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
FRONTEND_URL=https://yourdomain.com
```

### Frontend (.env)
```
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com
VITE_GOOGLE_CLIENT_ID=your_google_id
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Documentation: [docs/](./docs/)
- Issues: GitHub Issues
- Email: support@bluechat.app

---

**Ready to deploy?** Start with [DEPLOYMENT.md](./DEPLOYMENT.md)
"# bluechatclaude" 
"# bluechatclaude" 
"# bluechatclaude" 
