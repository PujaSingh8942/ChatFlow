import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Avatar } from "@mui/material";
import API from "../services/api";
import getSocket from "../services/socket";
import MessageInput from "./MessageInput";

export default function ChatWindow({ user, contact }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!user || !contact) return;

    const socket = getSocket();
    socket.emit("setup", user.id);

    const handleMessage = (msg) => {
      if (
        (msg.senderId === contact.id && msg.receiverId === user.id) ||
        (msg.senderId === user.id && msg.receiverId === contact.id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("message", handleMessage);
    return () => socket.off("message", handleMessage);
  }, [user, contact]);

  useEffect(() => {
    if (!user || !contact) return;
    async function load() {
      try {
        const res = await API.get(`/messages/${user.id}/${contact.id}`);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [user, contact]);

  async function onSend(content) {
    if (!user || !contact) return;
    const socket = getSocket();
    const payload = { senderId: user.id, receiverId: contact.id, content };
    socket.emit("private_message", payload);
  }

  const getUserInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f5f5f5",
        height: "100%"
      }}
    >
      {!contact ? (
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: '#ffffff'
        }}>
          <Typography variant="h6" color="textSecondary">
            Select a contact to start chatting
          </Typography>
        </Box>
      ) : (
        <>

          <Box sx={{ 
            bgcolor: '#ffffff', 
            p: 2, 
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Avatar 
              sx={{ 
                bgcolor: '#1976d2', 
                width: 45, 
                height: 45,
                fontSize: '16px',
                fontWeight: 600
              }}
            >
              {getUserInitials(contact.name)}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                {contact.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#666' }}>
                {contact.email}
              </Typography>
            </Box>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1
            }}
          >
            {messages.map((m, index) => {
              const isMine = m.senderId === user.id;
              return (
                <Box
                  key={m.id || index}
                  sx={{
                    display: "flex",
                    justifyContent: isMine ? "flex-end" : "flex-start",
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      maxWidth: "65%",
                      px: 2,
                      py: 1,
                      borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      bgcolor: isMine ? "#007bff" : "#e5e5ea",
                      color: isMine ? "#fff" : "#000",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        width: 0,
                        height: 0,
                        border: '8px solid transparent',
                        ...(isMine ? {
                          right: '-8px',
                          bottom: '4px',
                          borderLeftColor: '#007bff',
                          borderRight: 'none'
                        } : {
                          left: '-8px',
                          bottom: '4px',
                          borderRightColor: '#e5e5ea',
                          borderLeft: 'none'
                        })
                      }
                    }}
                  >
                    <Typography sx={{ fontSize: 14, lineHeight: 1.4 }}>
                      {m.content}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        textAlign: "right",
                        opacity: 0.7,
                        fontSize: 11,
                        mt: 0.3,
                      }}
                    >
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>


          <Box sx={{ bgcolor: '#ffffff', p: 2, borderTop: '1px solid #e0e0e0' }}>
            <MessageInput onSend={onSend} />
          </Box>
        </>
      )}
    </Box>
  );
}