const mongoose = require('mongoose');
const types = mongoose.Schema.Types;

const manhwaSchema = mongoose.Schema(
  {
    title: {
      type: types.String,
      required: true,
      unique: true,
    },
    slug: {
      type: types.String,
      required: true,
    },
    synopsis: {
      type: types.String,
      required: true,
    },
    description: {
      type: types.String,
      required: true,
    },
    startDate: {
      type: types.Date,
      required: false,
    },
    endDate: {
      type: types.Date,
      required: false,
    },
    type: {
      type: types.String,
      required: true,
    },
    image: {
      type: types.String,
      required: false,
    },
    coverImage: {
      type: types.String,
      required: false,
    },
    id: {
      type: types.Number,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);
const Manhwa = mongoose.model('Manhwa', manhwaSchema);
module.exports = Manhwa;
