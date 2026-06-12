const express = require('express');
const cheerioController = require('../controllers/cheerioController');

const router = express.Router();

router.get('/cheerio', cheerioController.procesarConCheerio);

module.exports = router;
