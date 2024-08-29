const mongoose = require('mongoose');
const types = mongoose.Schema.Types;

const manhwaSchema = mongoose.Schema(
  {
    title: {
      type: types.String,
      required: true,
      unique: true,
    },
    title_en: {
      type: types.String,
      required: false,
    },
    slug: {
      type: types.String,
      required: false,
    },
    synopsis: {
      type: types.String,
      required: false,
    },
    description: {
      type: types.String,
      required: false,
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
    smallImage: {
      type: types.String,
      required: false,
    },
    coverImage: {
      type: types.String,
      required: false,
    },
    id: {
      type: types.String,
      required: true,
    },
    status: {
      type: types.String,
      required: true,
    },
    description_fr: {
      type: types.String,
      required: false,
    },
    apiName: {
      type: types.String,
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
