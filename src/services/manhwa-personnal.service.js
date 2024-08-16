const ManhwaPersonnal = require('../models/manhwa-personnal.model');

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

const remove = async (manhwa, userId) => {
  const deletedManhwaPersonnal = await ManhwaPersonnal.findOneAndRemove({
    manhwa: manhwa._id,
    user: userId,
  });
  return deletedManhwaPersonnal ? deletedManhwaPersonnal._id : null;
};

const update = async (nbChapterViewed, id) => {
  return ManhwaPersonnal.findByIdAndUpdate(
    id,
    { nbChapterViewed },
    { new: true }
  );
};

module.exports = {
  create,
  createOrGet,
  getWithManhwa,
  remove,
  update,
};
