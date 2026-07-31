# BlueChat - Quick Start Guide (5 minutes)

## Option 1: Docker (Easiest - Recommended)

### Prerequisites
- Docker & Docker Compose installed
- Git installed

### Steps
```bash
# 1. Clone the repository
git clone https://github.com/yourusername/bluechat.git
cd bluechat-monorepo

# 2. Copy and configure environment
cp backend/.env.example backend/.env
# Edit backend/.env if needed (defaults should work)

# 3. Start all services
docker-compose up -d

# 4. Wait for services to be healthy (about 30 seconds)
docker-compose ps

# 5. Open in browser
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
# API Docs: http://localhost:3000/api/docs
```

### Test It
```bash
# Open http://localhost:5173 in your browser
# Click on a contact to start chatting
# Messages are sent and received in real-time via WebSocket
```

### Stop Services
```bash
docker-compose down
```

---

## Option 2: Manual Setup (Development)

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Git

### Backend Setup
```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your MongoDB URL
# nano .env

# 4. Start backend server
npm run dev

# Backend runs on: http://localhost:3000
```

### Frontend Setup (New terminal)
```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start frontend dev server
npm run dev

# Frontend runs on: http://localhost:5173
```

### Test It
```bash
# Open http://localhost:5173
# Create an account or login
# Start chatting with other users
```

---

## Testing the Application

### 1. Create Multiple Users
- Register with email1@example.com / Register with email2@example.com
- Open different browser tabs or windows

### 2. Send Messages
- Select a contact from the sidebar
- Type a message and press Send
- Watch real-time delivery via WebSocket

### 3. Test Features
- **Typing Indicator:** Watch "User is typing..." appear
- **Read Receipts:** Message shows as read when recipient opens chat
- **Reactions:** Click message to add emoji reactions
- **Groups:** Create group chats and invite members
- **Dark Mode:** Toggle in settings panel

### 4. API Testing
```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Use returned token in requests:
curl http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Troubleshooting

### Containers won't start
```bash
# Check logs
docker-compose logs -f

# Restart everything
docker-compose down -v
docker-compose up -d
```

### Port already in use
```bash
# Change ports in docker-compose.yml
# Or kill the process using the port:
lsof -i :3000
kill -9 <PID>
```

### MongoDB connection error
```bash
# Make sure MongoDB is running
docker exec bluechat-mongodb mongosh

# Or in development, ensure your .env has correct DATABASE_URL
```

### Frontend can't connect to backend
- Check that both servers are running
- Check CORS configuration in backend/src/server.js
- Verify `FRONTEND_URL` in .env matches your frontend URL

---

## Default Demo Data

The app comes with demo data:
- **Users:** alex, sam, jordan
- **Messages:** Pre-populated conversations
- **Groups:** Design Team, Project Alpha

### Reset Database
```bash
# With Docker
docker-compose down -v
docker-compose up -d

# Manually
# Delete MongoDB data and restart
```

---

## Next Steps

1. **Read the docs:** Check [README.md](./README.md) for full documentation
2. **Deploy:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
3. **Customize:** Modify colors, add features, deploy to your domain
4. **API Reference:** Full API docs at [api/docs/endpoints.md](./api/docs/endpoints.md)

---

## Key Files to Know

```
bluechat-monorepo/
├── frontend/src/          # React components and pages
├── backend/src/
│   ├── routes/           # API endpoints
│   ├── models/           # Database schemas
│   └── server.js         # Express setup
├── docker-compose.yml    # All services configuration
├── DEPLOYMENT.md         # Production deployment guide
└── api/docs/            # API documentation
```

---

## Common Commands

```bash
# Development
npm run dev          # Start in watch mode
npm run build        # Production build
npm test             # Run tests

# Docker
docker-compose up -d        # Start all services
docker-compose down         # Stop all services
docker-compose logs -f      # View logs
docker-compose ps           # Check status

# Database
mongosh mongodb://localhost:27017/bluechat   # Connect to database
# Then: db.users.find()                      # List users
```

---

## Support

- Documentation: [README.md](./README.md)
- API Docs: [api/docs/endpoints.md](./api/docs/endpoints.md)
- Deployment: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Issues: GitHub Issues

---

**Ready to go live?** Follow [DEPLOYMENT.md](./DEPLOYMENT.md)

**Questions?** Check the [API documentation](./api/docs/endpoints.md)
