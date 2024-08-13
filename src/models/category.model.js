const mongoose = require('mongoose');
const types = mongoose.Schema.Types;

const categorySchema = mongoose.Schema(
  {
    name: {
      type: types.String,
      required: true,
      unique: true,
    },
    slug: {
      type: types.String,
      required: true,
    },
    nsfw: {
      type: types.Boolean,
      required: true,
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

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
