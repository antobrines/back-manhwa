const mongoose = require('mongoose');
const types = mongoose.Schema.Types;
const User = require('./user.model');
const ManhwaPersonnal = require('./manhwa-personnal.model');

const librairySchema = mongoose.Schema(
  {
    name: {
      type: types.String,
      required: true,
      unique: false,
    },
    slug: {
      type: types.String,
      required: false,
    },
    user: {
      type: types.ObjectId,
      ref: User,
      required: true,
    },
    isRemovable: {
      type: types.Boolean,
      required: true,
    },
    manhwasPersonnal: [
      {
        type: types.ObjectId,
        ref: ManhwaPersonnal,
      },
    ],
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

const Librairy = mongoose.model('Librairy', librairySchema);
module.exports = Librairy;
