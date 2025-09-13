const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ----------------------------
// NEW ROUTE: Get recent chats for a user
// ----------------------------
router.get('/recent-chats/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    // Get all unique conversation partners for this user
    const conversations = await prisma.$queryRaw`
      SELECT DISTINCT
        CASE 
          WHEN m."senderId" = ${parseInt(userId)} THEN m."receiverId"
          ELSE m."senderId"
        END as "contactId"
      FROM "Message" m
      WHERE m."senderId" = ${parseInt(userId)} OR m."receiverId" = ${parseInt(userId)}
    `;

    // Get the last message for each conversation and user details
    const recentChats = await Promise.all(
      conversations.map(async (conv) => {
        const contactId = conv.contactId;
        
        // Get user details
        const contact = await prisma.user.findUnique({
          where: { id: contactId },
          select: { id: true, name: true, email: true, avatarUrl: true }
        });

        // Get the last message between these two users
        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: parseInt(userId), receiverId: contactId },
              { senderId: contactId, receiverId: parseInt(userId) }
            ]
          },
          orderBy: { createdAt: 'desc' },
          select: {
            content: true,
            createdAt: true,
            senderId: true
          }
        });

        return {
          ...contact,
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            createdAt: lastMessage.createdAt,
            isFromMe: lastMessage.senderId === parseInt(userId)
          } : null
        };
      })
    );

    // Sort by last message time (most recent first)
    recentChats.sort((a, b) => {
      if (!a.lastMessage && !b.lastMessage) return 0;
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
    });

    res.json(recentChats);
  } catch (err) {
    console.error('Recent chats error:', err);
    res.status(500).json({ error: 'Could not fetch recent chats' });
  }
});

// ----------------------------
// Existing route: Get conversation between two users
// ----------------------------
router.get('/:userId/:otherId', async (req, res) => {
  const { userId, otherId } = req.params;
  try {
    const msgs = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: Number(userId), receiverId: Number(otherId) },
          { senderId: Number(otherId), receiverId: Number(userId) }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });
    res.json(msgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'could not fetch messages' });
  }
});

// ----------------------------
// Existing route: Create a new message
// ----------------------------
router.post('/', async (req, res) => {
  const { senderId, receiverId, content } = req.body;
  try {
    const msg = await prisma.message.create({
      data: { senderId, receiverId, content }
    });
    res.json(msg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'could not create message' });
  }
});

module.exports = router;
