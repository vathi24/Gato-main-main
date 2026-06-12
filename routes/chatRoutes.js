const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.get('/rooms', chatController.listRooms);
router.post('/rooms', chatController.createRoom);
router.get('/messages/:room', chatController.listMessages);

module.exports = router;
