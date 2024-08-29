const express = require('express');
const manhwaPersonnal = require('../controllers/manhwa-personnal.controller');
const router = express.Router();
const { isConnected } = require('../middlewares/user.middleware');

router.put('/:id/chapters', isConnected, manhwaPersonnal.updateChapterViewed);
router.put('/:id/url', isConnected, manhwaPersonnal.updateUrl);

module.exports = router;
