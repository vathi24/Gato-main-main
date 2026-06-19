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
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 30;
  const result = chatService.getMessagesByRoom(room, offset, limit);
  res.json({ room, ...result });
}

function uploadFile(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No se envió ningún archivo.' });
  }

  const fileInfo = {
    url: `/uploads/${req.file.filename}`,
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
  };

  res.json({ success: true, file: fileInfo });
}

module.exports = {
  listRooms,
  createRoom,
  listMessages,
  uploadFile,
};
