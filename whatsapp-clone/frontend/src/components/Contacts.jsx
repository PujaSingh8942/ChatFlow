import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { List, ListItem, ListItemText, Avatar } from '@mui/material';

export default function Contacts({ user, setSelectedContact }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get('/users')
      .then(res => {
        const otherUsers = res.data.filter(u => u.id !== user.id);
        setUsers(otherUsers);
      })
      .catch(console.error);
  }, [user]);

  return (
    <List>
      {users.map(u => (
        <ListItem key={u.id} button onClick={() => setSelectedContact(u)}>
          <Avatar sx={{ mr: 2 }}>{u.name[0]}</Avatar>
          <ListItemText primary={u.name} secondary={u.email} />
        </ListItem>
      ))}
    </List>
  );
}
