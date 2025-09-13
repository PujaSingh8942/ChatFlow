import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Box, TextField, Button, Typography } from '@mui/material';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token); // if backend sends token
      setUser(res.data.user, res.data.token);

      navigate('/chat', { replace: true });
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
    }
  }

  return (
    <Box sx={{ m: 4, maxWidth: 400, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <form onSubmit={submit}>
        <TextField
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" type="submit" fullWidth>Login</Button>
      </form>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">
          Don't have an account?{' '}
          <span 
            style={{ color: '#1976d2', cursor: 'pointer' }} 
            onClick={() => navigate('/register')}
          >
            Register
          </span>
        </Typography>
      </Box>
    </Box>
  );
}
