const mongoose = require('mongoose');
const types = mongoose.Schema.Types;
const Manhwa = require('./manhwa.model');
const User = require('./user.model');

const manhwaPersonnalSchema = mongoose.Schema(
  {
    manhwa: {
      type: types.ObjectId,
      ref: Manhwa,
      required: true,
    },
    nbChapterViewed: {
      type: types.Number,
      required: false,
      default: 0,
    },
    nbChapters: {
      type: types.Number,
      required: false,
    },
    user: {
      type: types.ObjectId,
      ref: User,
    },
    url: {
      type: types.String,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);
const ManhwaPersonnal = mongoose.model(
  'ManhwaPersonnal',
  manhwaPersonnalSchema
);
module.exports = ManhwaPersonnal;
