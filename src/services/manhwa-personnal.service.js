const ManhwaPersonnal = require('../models/manhwa-personnal.model');
const Manhwa = require('../models/manhwa.model');
const Librairy = require('../models/librairy.model');

// ** Database Service ** //
const create = async (manhwaPersonnal) => {
  return ManhwaPersonnal.create(manhwaPersonnal);
};

const createOrGet = async (manhwaId, userId) => {
  const manhwaPersonnal = await ManhwaPersonnal.findOne({
    manhwa: manhwaId,
    user: userId,
  });
  if (manhwaPersonnal) {
    return manhwaPersonnal;
  } else {
    return create({ manhwa: manhwaId, user: userId });
  }
};

const getWithManhwa = async (userId) => {
  return ManhwaPersonnal.find({ user: userId }).populate('manhwa');
};

const getByManhwaIdApiAndUserId = async (manhwaApiId, userId) => {
  const manhwaItem = await Manhwa.findOne({ id: manhwaApiId });
  if (!manhwaItem) return null;
  const manhwaPersonnal = await ManhwaPersonnal.findOne({
    manhwa: manhwaItem._id,
    user: userId,
  }).populate('manhwa').lean();

  if (manhwaPersonnal) {
    const librairy = await Librairy.findOne({ manhwasPersonnal: manhwaPersonnal._id });
    if (librairy) {
      manhwaPersonnal.lib = {
        _id: librairy._id,
        name: librairy.name,
        slug: librairy.slug,
      };
    }
  }

  return manhwaPersonnal;
};

const remove = async (manhwa, userId) => {
  const deletedManhwaPersonnal = await ManhwaPersonnal.findOneAndRemove({
    manhwa: manhwa._id,
    user: userId,
  });
  return deletedManhwaPersonnal ? deletedManhwaPersonnal._id : null;
};

const updateChapterViewed = async (nbChapterViewed, _id) => {
  return ManhwaPersonnal.findByIdAndUpdate(
    _id,
    { nbChapterViewed },
    { new: true }
  );
};

const updateChapters = async (nbChapters, _id) => {
  return ManhwaPersonnal.findByIdAndUpdate(_id, { nbChapters }, { new: true });
}

const updateUrl = async (url, _id) => {
  return ManhwaPersonnal.findByIdAndUpdate(_id, { url }, { new: true });
};

module.exports = {
  create,
  createOrGet,
  getWithManhwa,
  getByManhwaIdApiAndUserId,
  remove,
  updateChapterViewed,
  updateUrl,
  updateChapters,
};
