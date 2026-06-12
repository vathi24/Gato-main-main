const chatService = require('../services/chatService');

function registerChatSocket(io) {
  io.on('connection', (socket) => {
    socket.on('joinRoom', ({ room, username }) => {
      const safeRoom = chatService.createRoom(room || 'General');
      socket.join(safeRoom);
      socket.data.username = (username || 'Anonimo').trim() || 'Anonimo';
      socket.data.room = safeRoom;

      socket.emit('roomHistory', {
        room: safeRoom,
        messages: chatService.getMessagesByRoom(safeRoom),
      });

      io.to(safeRoom).emit('systemMessage', {
        room: safeRoom,
        text: `${socket.data.username} se ha unido a la sala`,
      });
    });

    socket.on('sendMessage', ({ text }) => {
      const room = socket.data.room || 'General';
      const user = socket.data.username || 'Anonimo';

      if (!text || !text.trim()) {
        return;
      }

      const savedMessage = chatService.saveMessage({
        room,
        user,
        text: text.trim(),
      });

      io.to(room).emit('message', savedMessage);
    });
  });
}

module.exports = {
  registerChatSocket,
};
