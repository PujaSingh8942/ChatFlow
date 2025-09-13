import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { Box } from '@mui/material';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';

function App() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return <MainApp user={user} setUser={setUser} />;
}

function MainApp({ user, setUser }) {
  const [selectedContact, setSelectedContact] = useState(null);

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100vw',
      overflow: 'hidden'
    }}>
      <Sidebar user={user} setSelectedContact={setSelectedContact} />
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        height: '100vh'
      }}>
        <Topbar user={user} setUser={setUser} />
        <ChatWindow user={user} contact={selectedContact} />
      </Box>
    </Box>
  );
}

export default App;