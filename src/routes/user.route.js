const express = require('express')
const userController = require('../controllers/user.controller')
const authValidation = require('../validations/user.validation')
const validate = require('../middlewares/validate')
const router = express.Router()
const { isConnected } = require('../middlewares/user.middleware')
router.post(
  '/register',
  validate(authValidation.register),
  userController.register
)
router.post('/login', validate(authValidation.login), userController.login)
router.get('/test-connection', isConnected, userController.testConnection)

module.exports = router
