const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { successF } = require('../utils/message');
const manhwaService = require('../services/manhwa.service');

const getList = catchAsync(async (req, res) => {
  const { page, categories, limit, sort, type, text } = req.query;
  const { manhwaList, count } = await manhwaService.getManhwaList(
    categories,
    page,
    limit,
    sort,
    type,
    text
  );
  const toReturn = {
    manhwas: manhwaList,
    count,
    page,
    limit,
  };
  successF('Manhwas found', toReturn, httpStatus.OK, res);
});

const getManhwa = catchAsync(async (req, res) => {
  const { id } = req.params;
  const manhwa = await manhwaService.getManhwa(id);
  successF('Manhwa found', manhwa, httpStatus.OK, res);
});

module.exports = {
  getList,
  getManhwa,
};
