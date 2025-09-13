import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemText, Avatar, Tabs, Tab, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ContactsIcon from '@mui/icons-material/Contacts';
import Contacts from './Contacts';
import API from '../services/api';

export default function Sidebar({ user, setSelectedContact }) {
  const [tab, setTab] = useState(0);
  const [recentChats, setRecentChats] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(null);

  useEffect(() => {

    API.get(`/messages/recent-chats/${user.id}`)
      .then(res => {
        setRecentChats(res.data);
      })
      .catch(console.error);

   
    API.get('/users')
      .then(res => {
        const otherUsers = res.data.filter(u => u.id !== user.id);
        setAllContacts(otherUsers);
      })
      .catch(console.error);
  }, [user]);

  const getUserInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setSelectedContactId(contact.id);
  };

  const formatLastMessage = (lastMessage) => {
    if (!lastMessage) return 'No messages yet';
    
    const prefix = lastMessage.isFromMe ? 'You: ' : '';
    const content = lastMessage.content.length > 35 
      ? lastMessage.content.substring(0, 35) + '...' 
      : lastMessage.content;
    
    return prefix + content;
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    
    const messageDate = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <Box
      sx={{
        width: 300,
        bgcolor: '#2c3e50',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        borderRight: '1px solid #34495e',
      }}
    >

      <Box sx={{ bgcolor: '#34495e' }}>
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          textColor="inherit"
          TabIndicatorProps={{ style: { backgroundColor: '#3498db' } }}
          sx={{ 
            '& .MuiTab-root': { 
              color: '#bdc3c7',
              textTransform: 'none',
              fontWeight: 500,
              '&.Mui-selected': {
                color: '#fff'
              }
            }
          }}
        >
          <Tab 
            label="Chat" 
            sx={{ flex: 1 }} 
            icon={<ChatIcon sx={{ mr: 1 }} />}
            iconPosition="start"
          />
          <Tab 
            label="Contacts" 
            sx={{ flex: 1 }} 
            icon={<ContactsIcon sx={{ mr: 1 }} />}
            iconPosition="start"
          />
        </Tabs>
      </Box>


      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {tab === 0 ? (

          <List sx={{ py: 0 }}>
            {recentChats.length === 0 ? (
              <ListItem sx={{ py: 4, justifyContent: 'center' }}>
                <Typography variant="body2" color="textSecondary" sx={{ color: '#bdc3c7' }}>
                  No recent chats
                </Typography>
              </ListItem>
            ) : (
              recentChats.map(contact => (
                <ListItem
                  button
                  key={contact.id}
                  onClick={() => handleContactClick(contact)}
                  sx={{
                    py: 2,
                    px: 3,
                    borderBottom: '1px solid #34495e',
                    bgcolor: selectedContactId === contact.id ? '#34495e' : 'transparent',
                    '&:hover': { 
                      bgcolor: selectedContactId === contact.id ? '#34495e' : '#3a4f63' 
                    },
                  }}
                >
                  <Avatar 
                    sx={{ 
                      mr: 2, 
                      bgcolor: '#3498db',
                      width: 45,
                      height: 45,
                      fontSize: '16px',
                      fontWeight: 600
                    }}
                  >
                    {getUserInitials(contact.name)}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography
                        variant="body1"
                        sx={{ 
                          fontWeight: 600, 
                          color: '#fff',
                          fontSize: '16px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {contact.name}
                      </Typography>
                      {contact.lastMessage && (
                        <Typography
                          variant="caption"
                          sx={{ 
                            color: '#bdc3c7',
                            fontSize: '11px',
                            flexShrink: 0,
                            ml: 1
                          }}
                        >
                          {formatTime(contact.lastMessage.createdAt)}
                        </Typography>
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ 
                        color: '#bdc3c7',
                        fontSize: '13px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {formatLastMessage(contact.lastMessage)}
                    </Typography>
                  </Box>
                </ListItem>
              ))
            )}
          </List>
        ) : (

          <List sx={{ py: 0 }}>
            {allContacts.map(c => (
              <ListItem
                button
                key={c.id}
                onClick={() => handleContactClick(c)}
                sx={{
                  py: 2,
                  px: 3,
                  borderBottom: '1px solid #34495e',
                  bgcolor: selectedContactId === c.id ? '#34495e' : 'transparent',
                  '&:hover': { 
                    bgcolor: selectedContactId === c.id ? '#34495e' : '#3a4f63' 
                  },
                }}
              >
                <Avatar 
                  sx={{ 
                    mr: 2, 
                    bgcolor: '#3498db',
                    width: 45,
                    height: 45,
                    fontSize: '16px',
                    fontWeight: 600
                  }}
                >
                  {getUserInitials(c.name)}
                </Avatar>
                <ListItemText 
                  primary={
                    <span style={{ 
                      fontWeight: 600, 
                      color: '#fff',
                      fontSize: '16px' 
                    }}>
                      {c.name}
                    </span>
                  } 
                  secondary={
                    <span style={{ 
                      color: '#bdc3c7',
                      fontSize: '13px'
                    }}>
                      {c.email}
                    </span>
                  } 
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}