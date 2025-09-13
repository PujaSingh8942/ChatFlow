import React, { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';

export default function MessageInput({ onSend }) {
  const [text, setText] = useState('');

  function doSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  }

  return (
    <Box 
      component="form" 
      onSubmit={doSend} 
      sx={{ 
        display: 'flex', 
        gap: 1, 
        alignItems: 'center',
        bgcolor: '#f8f9fa',
        borderRadius: '25px',
        px: 2,
        py: 1
      }}
    >
      <IconButton size="small" sx={{ color: '#666' }}>
        <AttachFileIcon />
      </IconButton>
      
      <TextField 
        fullWidth 
        value={text} 
        onChange={e => setText(e.target.value)} 
        placeholder="Type a message" 
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: {
            fontSize: '14px',
            '& input': {
              py: 1
            }
          }
        }}
        sx={{
          '& .MuiInputBase-root': {
            bgcolor: 'transparent'
          }
        }}
      />
      
      <IconButton size="small" sx={{ color: '#007bff' }}>
        <EmojiEmotionsIcon />
      </IconButton>
      
      <IconButton 
        type="submit" 
        size="small"
        sx={{ 
          bgcolor: '#007bff !important',
          color: 'white !important',
          width: 32,
          height: 32,
          '&:hover': {
            bgcolor: '#0056b3 !important'
          },
          '&:disabled': {
            bgcolor: '#007bff !important',
            opacity: 0.6
          }
        }}
        disabled={!text.trim()}
      >
        <SendIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}