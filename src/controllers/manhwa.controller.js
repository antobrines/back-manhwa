const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { successF } = require('../utils/message');
const manhwaService = require('../services/manhwa.service');

const getList = catchAsync(async (req, res) => {
  const { page, categories, limit, sort, type, text, apiname } = req.query;
  const { manhwaList, count } = await manhwaService.getManhwaList(
    categories,
    page,
    limit,
    sort,
    type,
    text,
    apiname
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
  const { apiname } = req.query;
  const manhwa = await manhwaService.getManhwa(id, apiname);
  successF('Manhwa found', manhwa, httpStatus.OK, res);
});

module.exports = {
  getList,
  getManhwa,
};
