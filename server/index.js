const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const server = http.createServer(app);
const io = new Server(server);

app.use(cors({
  origin: 'http://localhost:5173/', // You may want to specify allowed origins in production
}));

const AllUsers = {};

// Socket connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join event - Add user to room and notify others
  socket.on('join', async ({ roomId, username }) => {
    try {
      AllUsers[socket.id] = username; // Store the user
      socket.join(roomId); // Join the specified room

      const Clients = await GetAllClients(roomId);
      
      // Notify other clients about the new user
      Clients.forEach(({ socketId }) => {
        socket.to(socketId).emit('joined', {
          Clients,
          username,
          SocketId: socket.id,
        });
      });
    } catch (err) {
      console.error('Error in join event:', err);
    }
  });

  // Disconnecting event - Notify others and cleanup user data
  socket.on('disconnecting', async () => {
    const rooms = [...socket.rooms]; // Get the rooms the socket is in
    rooms.forEach((roomId) => {
      if (roomId !== socket.id) { // Prevent emitting to the default room
        socket.to(roomId).emit('disconnected', {
          socketId: socket.id,
          username: AllUsers[socket.id],
        });
      }
    });

    delete AllUsers[socket.id]; // Remove the user data
  });

  // Typing code event - Share code updates with room
  socket.on('typingCode', ({ code, roomId }) => {
    socket.to(roomId).emit('recCode', { code });
  });

  // Language change event - Share language updates with room
  socket.on('send-lang', ({ language, roomId }) => {
    socket.to(roomId).emit('rec-lang', { language });
  });

  // Leave room event - Notify others and leave room
  socket.on('leaveRoom', ({ roomId }) => {
    socket.to(roomId).emit('left', {
      socketId: socket.id,
      username: AllUsers[socket.id],
    });

    delete AllUsers[socket.id]; // Remove the user data
    socket.leave(roomId); // Leave the specific room
  });
});

// Function to get all clients in a room
async function GetAllClients(roomId) {
  // Check if the room exists before attempting to map it
  const room = io.sockets.adapter.rooms.get(roomId);
  if (!room) return []; // Return an empty array if the room does not exist
  
  return Array.from(room).map((socketId) => ({
    socketId,
    username: AllUsers[socketId],
  }));
}

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
