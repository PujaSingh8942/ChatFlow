const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  await prisma.message.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.user.deleteMany();

  const pass = await bcrypt.hash('password123', 10);

  const alice = await prisma.user.create({
    data: { name: 'Alice', email: 'alice@example.com', password: pass, avatarUrl: null }
  });

  const bob = await prisma.user.create({
    data: { name: 'Bob', email: 'bob@example.com', password: pass, avatarUrl: null }
  });

  const charlie = await prisma.user.create({
    data: { name: 'Charlie', email: 'charlie@example.com', password: pass, avatarUrl: null }
  });

  // contacts
  await prisma.contact.createMany({
    data: [
      { ownerId: alice.id, contactId: bob.id },
      { ownerId: alice.id, contactId: charlie.id },
      { ownerId: bob.id, contactId: alice.id }
    ]
  });

  await prisma.message.createMany({
    data: [
      { senderId: alice.id, receiverId: bob.id, content: "Hey Bob, how are you?" },
      { senderId: bob.id, receiverId: alice.id, content: "I'm good, thanks Alice!" },
      { senderId: alice.id, receiverId: charlie.id, content: "Morning Charlie!" }
    ]
  });

  console.log('Seed completed.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
