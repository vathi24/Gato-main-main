const { readDb, writeDb } = require('../database/db');

const MESSAGES_PER_PAGE = 30;

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

function getMessagesByRoom(roomName, offset = 0, limit = MESSAGES_PER_PAGE) {
  const db = readDb();
  const room = normalizeRoom(roomName);
  const all = db.messages[room] || [];
  const total = all.length;
  const start = Math.max(0, total - offset - limit);
  const end = Math.max(0, total - offset);
  return {
    messages: all.slice(start, end),
    total,
    hasMore: start > 0,
  };
}

function saveMessage({ room, user, text, file }) {
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
    text: text || null,
    file: file || null,
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
