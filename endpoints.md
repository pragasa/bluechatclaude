# BlueChat API Documentation

## Base URL
```
Production: https://api.yourdomain.com/api/v1
Development: http://localhost:3000/api/v1
```

## Authentication

All endpoints (except `/auth/register` and `/auth/login`) require JWT token in header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "error": {
    "status": 400,
    "message": "Error description",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

## Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "accessToken": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=john_doe"
  }
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "status": "online"
  }
}
```

### Refresh Token
```http
POST /auth/refresh
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGc..."
}
```

### Logout
```http
POST /auth/logout
```

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

### Verify Token
```http
POST /auth/verify
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "valid": true,
  "userId": "507f1f77bcf86cd799439011"
}
```

---

## User Endpoints

### Get Current User
```http
GET /users/me
Authorization: Bearer <token>
```

### Get User by ID
```http
GET /users/:userId
Authorization: Bearer <token>
```

### Update User Profile
```http
PUT /users/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Software Developer",
  "avatar": "https://example.com/avatar.jpg",
  "status": "online",
  "theme": "dark"
}
```

### Search Users
```http
GET /users/search?q=john&limit=10
Authorization: Bearer <token>
```

### Get User Status
```http
GET /users/:userId/status
Authorization: Bearer <token>
```

### Update User Status
```http
PUT /users/:userId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "away"
}
```

**Status values:** `online`, `away`, `offline`, `dnd` (do not disturb)

---

## Chat Endpoints

### Get All Chats
```http
GET /chats?page=1&limit=20
Authorization: Bearer <token>
```

### Get Chat by ID
```http
GET /chats/:chatId
Authorization: Bearer <token>
```

### Create Direct Chat
```http
POST /chats
Authorization: Bearer <token>
Content-Type: application/json

{
  "participantId": "507f1f77bcf86cd799439011"
}
```

### Delete Chat
```http
DELETE /chats/:chatId
Authorization: Bearer <token>
```

### Archive Chat
```http
PUT /chats/:chatId/archive
Authorization: Bearer <token>
```

### Mark Chat as Read
```http
POST /chats/:chatId/read
Authorization: Bearer <token>
```

---

## Message Endpoints

### Get Chat Messages
```http
GET /messages/chat/:chatId?page=1&limit=50
Authorization: Bearer <token>
```

### Send Message
```http
POST /messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "chatId": "507f1f77bcf86cd799439012",
  "content": "Hello! How are you?",
  "fileId": "507f1f77bcf86cd799439013"
}
```

### Edit Message
```http
PUT /messages/:messageId
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated message content"
}
```

### Delete Message
```http
DELETE /messages/:messageId
Authorization: Bearer <token>
```

### Add Reaction to Message
```http
POST /messages/:messageId/reaction
Authorization: Bearer <token>
Content-Type: application/json

{
  "emoji": "👍"
}
```

### Remove Reaction from Message
```http
DELETE /messages/:messageId/reaction/:emoji
Authorization: Bearer <token>
```

### Mark Messages as Read
```http
POST /messages/batch/read
Authorization: Bearer <token>
Content-Type: application/json

{
  "messageIds": ["507f1f77bcf86cd799439014", "507f1f77bcf86cd799439015"]
}
```

### Search Messages in Chat
```http
GET /messages/chat/:chatId/search?q=keyword
Authorization: Bearer <token>
```

---

## Group Endpoints

### Get All Groups
```http
GET /groups?page=1&limit=20
Authorization: Bearer <token>
```

### Get Group by ID
```http
GET /groups/:groupId
Authorization: Bearer <token>
```

### Create Group
```http
POST /groups
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Development Team",
  "description": "Our development team discussions",
  "isPublic": false
}
```

### Update Group
```http
PUT /groups/:groupId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Group Name",
  "description": "Updated description",
  "avatar": "https://example.com/avatar.jpg"
}
```

### Delete Group
```http
DELETE /groups/:groupId
Authorization: Bearer <token>
```

### Add Member to Group
```http
POST /groups/:groupId/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011"
}
```

### Remove Member from Group
```http
DELETE /groups/:groupId/members/:userId
Authorization: Bearer <token>
```

### Update Member Role
```http
PUT /groups/:groupId/members/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "admin"
}
```

**Roles:** `member`, `moderator`, `admin`

### Get Group Messages
```http
GET /groups/:groupId/messages?page=1&limit=50
Authorization: Bearer <token>
```

### Send Message to Group
```http
POST /groups/:groupId/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Hello team!",
  "fileId": "507f1f77bcf86cd799439013"
}
```

---

## File Upload Endpoints

### Upload File
```http
POST /files
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary_file>
chatId: 507f1f77bcf86cd799439012
```

**Response (201 Created):**
```json
{
  "message": "File uploaded",
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "originalName": "photo.jpg",
    "filename": "1642254000-photo.jpg",
    "mimeType": "image/jpeg",
    "size": 102400,
    "url": "https://s3.amazonaws.com/bluechat-files/...",
    "uploadedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Get File
```http
GET /files/:fileId
Authorization: Bearer <token>
```

### Delete File
```http
DELETE /files/:fileId
Authorization: Bearer <token>
```

---

## WebSocket Events

Connect to: `ws://localhost:3000/socket.io`

### Client → Server Events

**User Join**
```javascript
socket.emit('user_join', {
  userId: '507f1f77bcf86cd799439011',
  chatId: '507f1f77bcf86cd799439012'
});
```

**User Typing**
```javascript
socket.emit('typing', {
  chatId: '507f1f77bcf86cd799439012',
  userId: '507f1f77bcf86cd799439011',
  isTyping: true
});
```

**New Message**
```javascript
socket.emit('new_message', {
  chatId: '507f1f77bcf86cd799439012',
  message: {
    content: 'Hello!',
    senderId: '507f1f77bcf86cd799439011'
  }
});
```

**Message Read**
```javascript
socket.emit('message_read', {
  chatId: '507f1f77bcf86cd799439012',
  messageId: '507f1f77bcf86cd799439014',
  userId: '507f1f77bcf86cd799439011'
});
```

**Add Reaction**
```javascript
socket.emit('add_reaction', {
  chatId: '507f1f77bcf86cd799439012',
  messageId: '507f1f77bcf86cd799439014',
  emoji: '👍',
  userId: '507f1f77bcf86cd799439011'
});
```

### Server → Client Events

**Message Received**
```javascript
socket.on('message_received', (data) => {
  console.log('New message:', data);
  // { id, content, senderId, chatId, timestamp }
});
```

**User Typing**
```javascript
socket.on('user_typing', (data) => {
  console.log('User is typing:', data);
  // { userId, isTyping }
});
```

**User Joined**
```javascript
socket.on('user_joined', (data) => {
  console.log('User joined:', data);
  // { userId, timestamp }
});
```

---

## Rate Limiting

API endpoints are rate limited:
- **General endpoints:** 100 requests per 15 minutes
- **Auth endpoints:** 20 requests per 15 minutes
- **File upload:** 10 requests per hour per user

Rate limit info in response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642254600
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

## Example: Complete Chat Flow

```javascript
// 1. Register
const registerRes = await fetch('http://localhost:3000/api/v1/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'securePassword123'
  })
});
const { accessToken, user } = await registerRes.json();

// 2. Create chat with user
const chatRes = await fetch('http://localhost:3000/api/v1/chats', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({ participantId: 'other_user_id' })
});
const { data: chat } = await chatRes.json();

// 3. Send message
const messageRes = await fetch('http://localhost:3000/api/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    chatId: chat.id,
    content: 'Hello there!'
  })
});

// 4. Connect WebSocket
const socket = io('http://localhost:3000');
socket.on('connect', () => {
  socket.emit('user_join', { userId: user.id, chatId: chat.id });
  socket.on('message_received', (msg) => console.log('New message:', msg));
});
```

---

For more info, see [openapi.yaml](./openapi.yaml)
