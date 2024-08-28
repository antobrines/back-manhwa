const config = require('../config');
const axios = require('axios');
const Manhwa = require('../models/manhwa.model');
const { createLogger } = require('../utils/log');
const logger = createLogger('deepl');

// ** API Service ** //
const getManhwaList = async (categories, page, limit, sort, type, text) => {
  const { currentLimit, currentPage, filters, currentSort } = getRequestParams(
    categories,
    page,
    limit,
    sort,
    type,
    text
  );
  console.log(
    `${config.apis.kitsu}/edge/manga?${filters}&page[limit]=${currentLimit}&page[offset]=${currentPage * currentLimit}&${currentSort}`
  );
  const response = await axios.get(
    `${config.apis.kitsu}/edge/manga?${filters}&page[limit]=${currentLimit}&page[offset]=${currentPage * currentLimit}&${currentSort}`
  );
  const manhwaList = response.data.data.map(formatManhwa);
  const count = response.data.meta.count;
  return { manhwaList, count };
};

const getManhwa = async (id) => {
  const response = await axios.get(`${config.apis.kitsu}/edge/manga/${id}`);
  console.log(`${config.apis.kitsu}/edge/manga/${id}`);
  const manhwa = formatManhwa(response.data.data);

  if ((await findByIdApi(id)) && manhwa) {
    return await update(manhwa);
  }
  return await create(manhwa);
};

const getRequestParams = (categories, page, limit, sort, type, text) => {
  const currentLimit = limit || 8;
  const currentPage = page || 0;
  const currentSort = sort || 'sort=-user_count';
  const filters = getFilters(categories, type, text);
  return {
    currentLimit,
    currentPage,
    filters,
    currentSort,
  };
};

const getFilters = (categories, type, text) => {
  let filters = '';
  if (categories) {
    filters = addAndFilter(filters, 'categories', categories);
  }
  if (type) {
    filters = addAndFilter(filters, 'subtype', type);
  }
  if (text) {
    filters = addAndFilter(filters, 'text', text);
  }
  return filters;
};

const addAndFilter = (filters, name, datas) => {
  if (filters.length > 0) {
    return filters + '&' + `filter[${name}]=${datas}`;
  }
  return filters + `filter[${name}]=${datas}`;
};

const deeplTranslate = async (text, targetLang) => {
  try {
    const response = await axios.post(
      config.deepl.url,
      {
        text: [text],
        target_lang: targetLang,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `DeepL-Auth-Key ${config.deepl.authKey}`,
        },
      }
    );
    logger.info(`Translation done with DeepL and nb char: ${text.length}`);
    return response.data.translations[0].text;
  } catch (error) {
    console.error(error);
    return text;
  }
};

// ** Database Service ** //
const create = async (manhwa) => {
  const translation = await deeplTranslate(manhwa.description, 'FR');
  manhwa.description_fr = translation;
  return Manhwa.create(manhwa);
};

const findByIdApi = async (id) => {
  return Manhwa.findOne({ id });
};

const findAllByIdApi = async (idArray) => {
  const manhwas = await Promise.all(
    idArray.map(async (id) => {
      return await Manhwa.findOne({ _id: id }, { id: 1, _id: 0 });
    })
  );
  return manhwas.map((manhwa) => manhwa.id.toString());
};

const update = async (manhwa) => {
  return Manhwa.findOneAndUpdate({ id: manhwa.id }, manhwa);
};

const createByIdApi = async (manhwaId) => {
  const manhwa = await findByIdApi(manhwaId);
  if (!manhwa) {
    const response = await axios.get(
      `${config.apis.kitsu}/edge/manga/${manhwaId}`
    );
    const manhwa = formatManhwa(response.data.data);
    return create(manhwa);
  }
  return manhwa;
};

const formatManhwa = (manhwa) => {
  return {
    id: manhwa.id,
    slug: manhwa.attributes.slug,
    synopsis: manhwa.attributes.synopsis,
    description: manhwa.attributes.description,
    title: manhwa.attributes.canonicalTitle,
    title_en: manhwa.attributes.titles.en,
    startDate: manhwa.attributes.startDate,
    endDate: manhwa.attributes.endDate,
    type: manhwa.attributes.subtype,
    image: manhwa.attributes?.posterImage?.medium,
    smallImage: manhwa.attributes?.posterImage?.small,
    coverImage: manhwa.attributes?.coverImage?.original,
    status: manhwa.attributes.status,
  };
};

module.exports = {
  getManhwaList,
  getManhwa,
  createByIdApi,
  findAllByIdApi,
};
