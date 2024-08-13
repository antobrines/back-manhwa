const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service');
const httpStatus = require('http-status');
const { errorF, successF } = require('../utils/message');
const constant = require('../config/constant');
const userError = constant.user.error;
const userSuccess = constant.user.success;

const register = catchAsync(async (req, res) => {
  const userCreated = await userService.create(req.body);
  successF(userSuccess.connected, userCreated, 200, res);
});

const login = catchAsync(async (req, res) => {
  const varLogged = await userService.login(req);
  if (varLogged == 'Invalid Credentiel') {
    const error = new Error(userError.wrongCredentiel);
    errorF(error.message, error, httpStatus.BAD_REQUEST, res);
  } else {
    successF(userSuccess.connected, varLogged, 200, res);
  }
});

const testConnection = catchAsync(async (req, res) => {
  const user = req.user;
  successF('User', user, 200, res);
});

module.exports = {
  register,
  login,
  testConnection,
};
