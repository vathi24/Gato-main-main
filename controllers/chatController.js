const chatService = require('../services/chatService');

function listRooms(req, res) {
  const rooms = chatService.getRooms();
  res.json({ rooms });
}

function createRoom(req, res) {
  const { room } = req.body;

  if (!room || !room.trim()) {
    return res.status(400).json({ error: 'El nombre de sala es obligatorio.' });
  }

  const createdRoom = chatService.createRoom(room);
  return res.status(201).json({ room: createdRoom });
}

function listMessages(req, res) {
  const { room } = req.params;
  const messages = chatService.getMessagesByRoom(room);
  res.json({ room, messages });
}

module.exports = {
  listRooms,
  createRoom,
  listMessages,
};
