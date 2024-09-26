const config = require('../config');
const axios = require('axios');
const Category = require('../models/category.model');
// const mangadexAuthService = require('./mangadex-auth.service');

// ** API Service ** //
const getCategoryList = async (type, apiName) => {
  let response;
  if (apiName === 'kitsu') {
    response = await axios.get(
      `${config.apis.kitsu}/edge/categories?page[limit]=10000`
    );
  } else {
    try {
      response = await axios.get(`${config.apis.mangadex}/manga/tag`, {
        // headers: {
        //   Authorization: `Bearer ${await mangadexAuthService.getMangaDexAccessToken()}`,
        // },
      });
    } catch (error) {
      console.error(error);
    }
  }
  const categoryList = response.data.data.map((category) => {
    if (apiName === 'kitsu') {
      return {
        id: category.id,
        name: category.attributes.title,
        slug: category.attributes.slug,
        nsfw: category.attributes.nsfw,
        apiName: 'kitsu',
        format: 'theme',
      };
    }
    return {
      id: category.id,
      name: category.attributes.name.en,
      nsfw: false,
      apiName: 'mangadex',
      format: category.attributes.group,
    };
  });

  // categoryList.forEach(async (category) => {
  //   if ((await findByIdApi(category.id)) && category) {
  //     await update(category);
  //   } else {
  //     await create(category);
  //   }
  // });
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
  update,
  findByIdApi,
};
