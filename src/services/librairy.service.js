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

const getLibrairyWithManhwasInformations = async (librairyId, sort) => {
  let realSort = {};
  if (sort) {
    if (sort === 'nbChapterViewedDesc') {
      realSort = { nbChapterViewed: -1 };
    }
    if (sort === 'nbChapterViewedAsc') {
      realSort = { nbChapterViewed: 1 };
    }
  }
  return Librairy.findById(librairyId)
    .populate({
      path: 'manhwasPersonnal',
      populate: {
        path: 'manhwa',
        model: 'Manhwa',
      },
      options: {
        sort: realSort,
      },
    })
    .then((librairy) => {
      if (sort && librairy) {
        if (sort === 'titleAsc') {
          librairy.manhwasPersonnal.sort((a, b) => {
            if (a.manhwa.title_en < b.manhwa.title_en) return -1;
            if (a.manhwa.title_en > b.manhwa.title_en) return 1;
            return 0;
          });
        }
        if (sort === 'titleDesc') {
          librairy.manhwasPersonnal.sort((a, b) => {
            if (a.manhwa.title_en < b.manhwa.title_en) return 1;
            if (a.manhwa.title_en > b.manhwa.title_en) return -1;
            return 0;
          });
        }
      }
      return librairy;
    });
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

const changeList = async (manhwaId, userId, toList, fromList, apiName) => {
  const manhwa = await manhwaService.createByIdApi(manhwaId, apiName);
  const manhwaPersonnal = await manhwaPersonnalService.createOrGet(
    manhwa,
    userId
  );
  const oldLibrairy = await Librairy.findOne({ _id: fromList, user: userId });
  await Librairy.findByIdAndUpdate(
    oldLibrairy._id,
    { $pull: {
      manhwasPersonnal: manhwaPersonnal._id,
    } },
    { new: true }
  );
  const newLibrairy = await Librairy.findOne({ _id: toList, user: userId });
  return Librairy.findByIdAndUpdate(
    newLibrairy._id,
    { $addToSet: {
      manhwasPersonnal: manhwaPersonnal._id,
    } },
    { new: true }
  );
}

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
  changeList,
};
