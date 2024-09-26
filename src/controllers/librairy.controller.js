const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { successF } = require('../utils/message');
const librairyService = require('../services/librairy.service');

const create = catchAsync(async (req, res) => {
  const librairy = await librairyService.create(req.body);
  successF('Manhwas found', librairy, httpStatus.OK, res);
});

const get = catchAsync(async (req, res) => {
  const librairies = await librairyService.getLibrairies(req.user.userId);
  successF('Manhwas found', librairies, httpStatus.OK, res);
});

const getLibrairyWithManhwasInformations = catchAsync(async (req, res) => {
  const { librairyId } = req.params;
  const sort = req.query.sort;
  const librairy = await librairyService.getLibrairyWithManhwasInformations(
    librairyId,
    sort
  );
  successF('Librairy with Manhwas informations', librairy, httpStatus.OK, res);
});

const getManhwasFromLibrairies = catchAsync(async (req, res) => {
  const manhwas = await librairyService.getManhwasFromLibrairies(
    req.user.userId
  );
  successF('All manhwas in a librairy', manhwas, httpStatus.OK, res);
});

const addManhwa = catchAsync(async (req, res) => {
  const { librairyId, id, apiname } = req.params;
  const user = req.user;
  const librairy = await librairyService.addManhwa(
    librairyId,
    id,
    user.userId,
    apiname
  );
  successF(
    `Manhwa added to the librairy "${librairy.name}"`,
    librairy,
    httpStatus.OK,
    res
  );
});

const removeManhwa = catchAsync(async (req, res) => {
  const { librairyId, id, apiname } = req.params;
  const user = req.user;
  const librairy = await librairyService.removeManhwa(
    librairyId,
    id,
    user.userId,
    apiname
  );
  successF(
    `Manhwa removed from the librairy ${librairy.name}`,
    librairy,
    httpStatus.OK,
    res
  );
});

module.exports = {
  create,
  get,
  addManhwa,
  removeManhwa,
  getLibrairyWithManhwasInformations,
  getManhwasFromLibrairies,
};
