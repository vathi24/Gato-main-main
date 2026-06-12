const { readDb, writeDb } = require('../database/db');

function normalizeRoom(room) {
  return (room || 'General').trim() || 'General';
}

function getRooms() {
  const db = readDb();
  return db.rooms;
}

function createRoom(roomName) {
  const db = readDb();
  const room = normalizeRoom(roomName);

  if (!db.rooms.includes(room)) {
    db.rooms.push(room);
    db.messages[room] = [];
    writeDb(db);
  }

  return room;
}

function getMessagesByRoom(roomName) {
  const db = readDb();
  const room = normalizeRoom(roomName);
  return db.messages[room] || [];
}

function saveMessage({ room, user, text }) {
  const db = readDb();
  const targetRoom = normalizeRoom(room);

  if (!db.rooms.includes(targetRoom)) {
    db.rooms.push(targetRoom);
    db.messages[targetRoom] = [];
  }

  const message = {
    id: Date.now(),
    room: targetRoom,
    user: user || 'Anonimo',
    text,
    createdAt: new Date().toISOString(),
  };

  db.messages[targetRoom].push(message);
  writeDb(db);

  return message;
}

module.exports = {
  getRooms,
  createRoom,
  getMessagesByRoom,
  saveMessage,
};
