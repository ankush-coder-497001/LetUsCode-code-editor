const express = require('express');
const app = express();
const http = require('http');
const {Server} = require('socket.io')
const cors  = require('cors');

const server = http.createServer(app);
const io  = new Server(server);


app.use(cors({
<<<<<<< HEAD
  origin: '*'
=======
  origin: 'https://let-us-code-ankush.netlify.app/'
>>>>>>> b84bc6e990d3e04bb8e11d1e18bb19031819e6e4
}));


const AllUsers = {};

io.on('connection',(socket)=>{

socket.on('join',({roomId,username})=>{
AllUsers[socket.id] = username;
socket.join(roomId);
const Clients  = GetAllClients(roomId);
Clients.forEach(({socketId})=>{
  socket.to(socketId).emit('joined',{
    Clients,
    username,
      SocketId:socket.id,
  });
})
})

socket.on('disconnecting',()=>{
  const rooms = [...socket.rooms];
  rooms.forEach((roomId)=>{
    socket.in(roomId).emit('disconnected',{
   socketId:socket.id,
   username:AllUsers[socket.id],
    })
  })

  delete AllUsers[socket.id];
  socket.leave();

})

socket.on('typingCode',({code,roomId})=>{
  socket.in(roomId).emit('recCode', { code });
})

socket.on('send-lang',({language,roomId})=>{
  socket.in(roomId).emit('rec-lang',{language});
})

socket.on('leaveRoom',({roomId})=>{
  const rooms = [...socket.rooms];

  const myroom = rooms.filter((room)=>room ===roomId);
    socket.in(myroom).emit('left',{
   socketId:socket.id,
   username:AllUsers[socket.id],
    })
  delete AllUsers[socket.id];
  socket.leave();

})

})

function GetAllClients(roomId){
  return Array.from(io.sockets.adapter.rooms.get(roomId)).map((socketId)=>{
    return{
      socketId,
      username:AllUsers[socketId],
    }
  })
}


const PORT = process.env.PORT || 5000;
server.listen(PORT,()=>{
  console.log(`Server is running on ${PORT}`);
})
