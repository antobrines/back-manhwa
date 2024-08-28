const express = require('express');
const manhwaController = require('../controllers/manhwa.controller');
const router = express.Router();
const { isConnected } = require('../middlewares/user.middleware');
const validate = require('../middlewares/validate');
const manhwaValidation = require('../validations/manhwa.validation');

router.get(
  '/',
  isConnected,
  validate(manhwaValidation.getList),
  manhwaController.getList
);
router.get('/:id', isConnected, manhwaController.getManhwa);

module.exports = router;
