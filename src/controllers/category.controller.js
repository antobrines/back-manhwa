const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { successF } = require('../utils/message');
const categoryService = require('../services/category.service');

const getList = catchAsync(async (req, res) => {
  const categories = await categoryService.getCategoryList();
  successF('Manhwas found', categories, httpStatus.OK, res);
});

module.exports = {
  getList,
};
