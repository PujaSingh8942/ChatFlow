import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';

export default function Topbar({ user, setUser }) {
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  }

  const getUserInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        bgcolor: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        height: '64px'
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', height: '100%' }}>
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#1976d2', 
              fontWeight: 600,
              borderBottom: '2px solid #1976d2',
              pb: 0.5
            }}
          >
            Message
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#666',
              fontWeight: 400,
              cursor: 'pointer',
              '&:hover': { color: '#1976d2' }
            }}
          >
            Dashboard
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: '#1976d2', 
              width: 40, 
              height: 40,
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            {getUserInitials(user.name)}
          </Avatar>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#333',
              fontWeight: 500
            }}
          >
            {user.name}
          </Typography>
          <Button 
            onClick={logout} 
            variant="outlined"
            size="small"
            sx={{
              borderColor: '#d32f2f',
              color: '#d32f2f',
              textTransform: 'none',
              fontWeight: 500,
              px: 2,
              py: 0.5,
              '&:hover': {
                borderColor: '#d32f2f',
                bgcolor: '#d32f2f',
                color: 'white'
              }
            }}
          >
            LOGOUT
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}