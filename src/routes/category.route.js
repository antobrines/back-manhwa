const express = require('express');
const categoryController = require('../controllers/category.controller');
const router = express.Router();
// const { isConnected } = require('../middlewares/user.middleware');

router.get('/', categoryController.getList);

module.exports = router;
