const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// get all users (for contacts search)
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, avatarUrl: true }
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'could not fetch users' });
  }
});

// get contacts for a user
router.get('/:id/contacts', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const contacts = await prisma.contact.findMany({
      where: { ownerId: id },
      include: { contact: { select: { id: true, name: true, email: true, avatarUrl: true } } }
    });
    res.json(contacts.map(c => c.contact));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'could not fetch contacts' });
  }
});

module.exports = router;
