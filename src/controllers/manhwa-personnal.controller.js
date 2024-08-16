const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { successF } = require('../utils/message');
const manhwaPersonnalS = require('../services/manhwa-personnal.service');

const update = catchAsync(async (req, res) => {
  const { nbChapterViewed } = req.body;
  const id = req.params.id;
  const manhwaPersonnal = await manhwaPersonnalS.update(nbChapterViewed, id);
  successF('nbViewedUpdated', manhwaPersonnal, httpStatus.OK, res);
});

module.exports = {
  update,
};
