import React, { useState } from 'react';
import API from '../services/api';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      await API.post('/auth/register', { name, email, password });
      alert('Registered successfully. Please login.');
      nav('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Register failed');
    }
  }

  return (
    <Box sx={{ m: 4 }}>
      <Typography variant="h4" gutterBottom>Register</Typography>
      <form onSubmit={submit}>
        <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth sx={{mb:2}} />
        <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth sx={{mb:2}} />
        <TextField label="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" fullWidth sx={{mb:2}} />
        <Button variant="contained" type="submit">Register</Button>
      </form>
    </Box>
  );
}
