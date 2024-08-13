const config = require('../config');
const axios = require('axios');
const Category = require('../models/category.model');

// ** API Service ** //
const getCategoryList = async () => {
  const response = await axios.get(
    `${config.apiUrl}/edge/categories?page[limit]=10000`
  );
  const categoryList = response.data.data.map((category) => ({
    id: category.id,
    name: category.attributes.title,
    slug: category.attributes.slug,
    nsfw: category.attributes.nsfw,
  }));

  categoryList.forEach(async (category) => {
    if ((await findByIdApi(category.id)) && category) {
      await update(category);
    } else {
      await create(category);
    }
  });
  return categoryList;
};

// ** Database Service ** //
const create = async (category) => {
  return Category.create(category);
};

const update = async (category) => {
  return Category.findOneAndUpdate({ id: category.id }, category);
};

const findByIdApi = async (id) => {
  return Category.findOne({ id });
};

module.exports = {
  getCategoryList,
  create,
};
