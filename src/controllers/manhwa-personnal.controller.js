const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { successF } = require('../utils/message');
const manhwaPersonnalS = require('../services/manhwa-personnal.service');

const updateChapterViewed = catchAsync(async (req, res) => {
  const { nbChapterViewed } = req.body;
  const id = req.params.id;
  const manhwaPersonnal = await manhwaPersonnalS.updateChapterViewed(
    nbChapterViewed,
    id
  );
  successF('nbViewedUpdated', manhwaPersonnal, httpStatus.OK, res);
});

const updateChapters = catchAsync(async (req, res) => {
  const { nbChapters } = req.body;
  const id = req.params.id;
  const manhwaPersonnal = await manhwaPersonnalS.updateChapters(nbChapters, id);
  successF('nbChaptersUpdated', manhwaPersonnal, httpStatus.OK, res);
});

const updateUrl = catchAsync(async (req, res) => {
  const { url } = req.body;
  const id = req.params.id;
  const manhwaPersonnal = await manhwaPersonnalS.updateUrl(url, id);
  successF('urlUpdated', manhwaPersonnal, httpStatus.OK, res);
});
const getByManhwaIdApi = catchAsync(async (req, res) => {
  const manhwaApiId = req.params.id;
  const userId = req.user.userId;
  const manhwaPersonnal = await manhwaPersonnalS.getByManhwaIdApiAndUserId(
    manhwaApiId,
    userId
  );
  if (!manhwaPersonnal) {
    return res.status(httpStatus.NOT_FOUND).json({ message: 'Not found' });
  }
  successF('manhwaPersonnalFound', manhwaPersonnal, httpStatus.OK, res);
});

module.exports = {
  updateChapterViewed,
  updateUrl,
  updateChapters,
  getByManhwaIdApi,
};
