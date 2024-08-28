const express = require('express');
const categoryController = require('../controllers/category.controller');
const router = express.Router();
const { isConnected } = require('../middlewares/user.middleware');
const validate = require('../middlewares/validate');
const categoryValidation = require('../validations/category.validation');

router.get(
  '/',
  isConnected,
  validate(categoryValidation.getList),
  categoryController.getList
);

module.exports = router;
