const Librairy = require('../models/librairy.model');
const manhwaService = require('./manhwa.service');
const manhwaPersonnalService = require('./manhwa-personnal.service');

// ** Database Service ** //
const create = async (librairy) => {
  return Librairy.create(librairy);
};

const getLibrairies = async (userId) => {
  return Librairy.find({ user: userId });
};

const getLibrairyWithManhwasInformations = async (librairyId) => {
  return Librairy.findById(librairyId)
    .populate({
      path: 'manhwasPersonnal',
      populate: {
        path: 'manhwa',
        model: 'Manhwa',
      },
    })
    .exec();
};

const getManhwasFromLibrairies = async (userId) => {
  const manhwaPersonnals = await manhwaPersonnalService.getWithManhwa(userId);
  const manhwaIds = manhwaPersonnals.map((manhwaPersonnal) =>
    manhwaPersonnal.manhwa.id.toString()
  );
  return manhwaIds;
};

const addManhwa = async (librairyId, manhwaId, userId, apiName) => {
  const manhwa = await manhwaService.createByIdApi(manhwaId, apiName);
  const manhwaPersonnal = await manhwaPersonnalService.createOrGet(
    manhwa._id,
    userId
  );
  return Librairy.findByIdAndUpdate(
    librairyId,
    { $addToSet: { manhwasPersonnal: manhwaPersonnal._id } },
    { new: true }
  );
};

const removeManhwa = async (librairyId, manhwaId, userId, apiName) => {
  const manhwa = await manhwaService.createByIdApi(manhwaId, apiName);
  const manhwaPersonnal = await manhwaPersonnalService.remove(manhwa, userId);
  return Librairy.findByIdAndUpdate(
    librairyId,
    { $pull: { manhwasPersonnal: manhwaPersonnal._id } },
    { new: true }
  );
};

const createStandardList = async (userId) => {
  const librairies = [
    {
      name: 'À lire',
      slug: 'planned',
      isRemovable: false,
      user: userId,
    },
    {
      name: 'En cours',
      slug: 'current',
      isRemovable: false,
      user: userId,
    },
    {
      name: 'Terminé',
      slug: 'completed',
      isRemovable: false,
      user: userId,
    },
    {
      name: 'En attente',
      slug: 'on_hold',
      isRemovable: false,
      user: userId,
    },
    {
      name: 'Abandonné',
      slug: 'dropped',
      isRemovable: false,
      user: userId,
    },
  ];
  return Librairy.insertMany(librairies);
};

module.exports = {
  create,
  createStandardList,
  getLibrairies,
  addManhwa,
  removeManhwa,
  getLibrairyWithManhwasInformations,
  getManhwasFromLibrairies,
};
