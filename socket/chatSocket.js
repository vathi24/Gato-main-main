const chatService = require('../services/chatService');

function registerChatSocket(io) {
  io.on('connection', (socket) => {
    socket.on('joinRoom', ({ room, username }) => {
      const safeRoom = chatService.createRoom(room || 'General');
      socket.join(safeRoom);
      socket.data.username = (username || 'Anonimo').trim() || 'Anonimo';
      socket.data.room = safeRoom;

      const { messages, total } = chatService.getMessagesByRoom(safeRoom, 0, 30);

      socket.emit('roomHistory', {
        room: safeRoom,
        messages,
        total,
        hasMore: total > 30,
      });

      socket.to(safeRoom).emit('systemMessage', {
        room: safeRoom,
        text: `${socket.data.username} se ha unido a la sala`,
      });

      socket.to(safeRoom).emit('notification', {
        type: 'join',
        text: `${socket.data.username} se ha unido a la sala`,
        room: safeRoom,
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

      socket.to(room).emit('notification', {
        type: 'message',
        text: `${user}: ${text.trim().slice(0, 100)}`,
        room,
      });
    });

    socket.on('sendFileMessage', ({ file }) => {
      const room = socket.data.room || 'General';
      const user = socket.data.username || 'Anonimo';

      const savedMessage = chatService.saveMessage({
        room,
        user,
        file,
      });

      io.to(room).emit('message', savedMessage);

      socket.to(room).emit('notification', {
        type: 'file',
        text: `${user} ha compartido un archivo: ${file.name}`,
        room,
      });
    });

    socket.on('loadMoreMessages', ({ room, offset }, callback) => {
      const safeRoom = chatService.createRoom(room || 'General');
      const result = chatService.getMessagesByRoom(safeRoom, offset, 30);
      if (typeof callback === 'function') {
        callback(result);
      }
    });
  });
}

module.exports = {
  registerChatSocket,
};
