# ChatFlow

**ChatFlow** is a full-stack chat application built with React, Node.js, Express, Prisma, and PostgreSQL.  
It features real-time messaging, user authentication, recent chats, and contact management.  
The UI is built with Material-UI for a clean and responsive design. This project demonstrates a complete end-to-end implementation suitable for professional assignments or portfolio showcase.

---

## Features

- User registration and login with authentication  
- Real-time messaging via WebSockets  
- View recent chats with last message preview  
- Manage contacts and start new conversations  
- Responsive and clean UI using Material-UI  

---

## Tech Stack

- **Frontend:** React, Material-UI  
- **Backend:** Node.js, Express, Prisma  
- **Database:** PostgreSQL  
- **Real-time:** Socket.IO  

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PujaSingh8942/ChatFlow.git

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Go back to project root
cd ..

# Start backend and frontend concurrently
# If you have a script to run both at the same time (optional), otherwise start separately:

# Start backend
cd backend
npm run dev
# Open a new terminal for frontend

cd ../frontend
npm run dev