const mongoose = require('mongoose');
const types = mongoose.Schema.Types;

const categorySchema = mongoose.Schema(
  {
    name: {
      type: types.String,
      required: true,
    },
    slug: {
      type: types.String,
      required: false,
    },
    nsfw: {
      type: types.Boolean,
      required: true,
    },
    id: {
      type: types.String,
      required: true,
    },
    apiName: {
      type: types.String,
      required: true,
    },
    format: {
      type: types.String,
      required: false,
    },
  },
  {
    versionKey: false,
    timestamps: false,
  }
);

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
