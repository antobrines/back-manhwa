const express = require('express');
const manhwaPersonnal = require('../controllers/manhwa-personnal.controller');
const router = express.Router();
const { isConnected } = require('../middlewares/user.middleware');

router.put('/:id', isConnected, manhwaPersonnal.update);

module.exports = router;
