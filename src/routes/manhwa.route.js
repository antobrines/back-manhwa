const express = require('express');
const manhwaController = require('../controllers/manhwa.controller');
const router = express.Router();
const { isConnected } = require('../middlewares/user.middleware');

router.get('/', manhwaController.getList);
router.get('/:id', manhwaController.getManhwa);

module.exports = router;
