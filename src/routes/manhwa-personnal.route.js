const express = require('express');
const manhwaPersonnal = require('../controllers/manhwa-personnal.controller');
const router = express.Router();
const { isConnected } = require('../middlewares/user.middleware');

router.put('/:id/chapters', isConnected, manhwaPersonnal.updateChapterViewed);
router.put('/:id/url', isConnected, manhwaPersonnal.updateUrl);
router.put('/:id/chapters-total', isConnected, manhwaPersonnal.updateChapters);

module.exports = router;
