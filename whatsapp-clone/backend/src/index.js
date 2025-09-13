require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

// Initialize Prisma with error handling
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Test database connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// Auth middleware
function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }
    
    const token = header.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Missing token' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const messagesRouter = require('./routes/messages');

app.use('/api/auth', authRouter);
app.use('/api/users', authMiddleware, usersRouter);
app.use('/api/messages', authMiddleware, messagesRouter);

// Socket.IO setup
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { 
    origin: ['http://localhost:3000', 'http://localhost:5173'], 
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const onlineUsers = new Map();

// Optional socket authentication middleware (can be disabled for testing)
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  // If no token provided, still allow connection but log it
  if (!token) {
    console.log('Socket connected without token:', socket.id);
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = payload.id;
    socket.userEmail = payload.email;
    console.log('Socket authenticated for user:', payload.id);
    next();
  } catch (err) {
    console.error('Socket auth error:', err);
    // For now, allow connection even with invalid token
    console.log('Allowing connection despite auth error');
    next();
  }
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('setup', (userId) => {
    try {
      onlineUsers.set(String(userId), socket.id);
      socket.join(String(userId));
      console.log('User online:', userId);
    } catch (error) {
      console.error('Setup error:', error);
    }
  });

  socket.on('private_message', async (payload) => {
    try {
      console.log('Received message:', payload);
      
      // Basic validation
      if (!payload.senderId || !payload.receiverId || !payload.content) {
        console.error('Invalid message payload:', payload);
        socket.emit('error', { message: 'Invalid message payload' });
        return;
      }

      const msg = await prisma.message.create({
        data: {
          senderId: parseInt(payload.senderId),
          receiverId: parseInt(payload.receiverId),
          content: payload.content
        }
      });

      console.log('Message saved:', msg.id);

      // Emit to receiver
      const recvSocketId = onlineUsers.get(String(payload.receiverId));
      if (recvSocketId) {
        io.to(recvSocketId).emit('message', msg);
        console.log('Message sent to receiver');
      }
      
      // Emit back to sender
      socket.emit('message', msg);
      
    } catch (e) {
      console.error('Socket message error:', e);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', socket.id, 'reason:', reason);
    for (const [userId, sId] of onlineUsers.entries()) {
      if (sId === socket.id) {
        onlineUsers.delete(userId);
        console.log('User offline:', userId);
        break;
      }
    }
  });

  // Handle any socket errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function startServer() {
  try {
    await testConnection();
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});