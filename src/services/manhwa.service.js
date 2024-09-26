const config = require('../config');
const axios = require('axios');
const Manhwa = require('../models/manhwa.model');
const { createLogger } = require('../utils/log');
const logger = createLogger();
// const mangaDexAuthService = require('./mangadex-auth.service');

// ** API Service ** //
const getManhwaList = async (
  categories,
  page,
  limit,
  sort,
  type,
  text,
  apiName
) => {
  const { currentLimit, currentPage, filters, currentSort } = getRequestParams(
    categories,
    page,
    limit,
    sort,
    type,
    text,
    apiName
  );
  let response;
  if (apiName === 'kitsu') {
    console.log(
      `${config.apis.kitsu}/edge/manga?${filters}&page[limit]=${currentLimit}&page[offset]=${currentPage * currentLimit}&${currentSort}`
    );
    response = await axios.get(
      `${config.apis.kitsu}/edge/manga?${filters}&page[limit]=${currentLimit}&page[offset]=${currentPage * currentLimit}&${currentSort}`
    );
  } else {
    console.log(
      `${config.apis.mangadex}/manga?${filters}&includes[]=cover_art&limit=${currentLimit}&offset=${currentPage * currentLimit}&${currentSort}`
    );
    response = await axios.get(
      `${config.apis.mangadex}/manga?${filters}&includes[]=cover_art&limit=${currentLimit}&offset=${currentPage * currentLimit}&${currentSort}`
      // {
      //   headers: {
      //     Authorization: `Bearer ${await mangaDexAuthService.getMangaDexAccessToken()}`,
      //   },
      // }
    );
  }
  const manhwaList = response.data.data.map((manhwa) => {
    return formatManhwa(manhwa, apiName);
  });
  const count =
    apiName === 'kitsu' ? response.data.meta.count : response.data.total;
  return { manhwaList, count };
};

const getManhwa = async (id, apiName) => {
  let response;
  if (apiName === 'kitsu') {
    response = await axios.get(`${config.apis.kitsu}/edge/manga/${id}`);
  } else {
    response = await axios.get(
      `${config.apis.mangadex}/manga/${id}?includes[]=cover_art`
      // {
      //   headers: {
      //     Authorization: `Bearer ${await mangaDexAuthService.getMangaDexAccessToken()}`,
      //   },
      // }
    );
  }
  const manhwa = formatManhwa(response.data.data, apiName);

  if ((await findByIdApi(id)) && manhwa) {
    return await update(manhwa);
  }
  return await create(manhwa);
};

const getRequestParams = (
  categories,
  page,
  limit,
  sort,
  type,
  text,
  apiName
) => {
  const currentLimit = limit || 8;
  const currentPage = page || 0;
  const currentSort = sort || '';
  const filters = getFilters(categories, type, text, apiName);
  return {
    currentLimit,
    currentPage,
    filters,
    currentSort,
  };
};

const getFilters = (categories, type, text, apiName) => {
  let filters = '';
  if (categories) {
    if (apiName === 'kitsu') {
      filters = addAndFilter(filters, 'categories', categories, apiName);
    } else {
      filters = addAndFilter(filters, 'includedTags[]', categories, apiName);
    }
  }
  if (type) {
    filters = addAndFilter(filters, 'subtype', type, apiName);
  }
  if (text) {
    if (apiName === 'kitsu') {
      filters = addAndFilter(filters, 'text', text, apiName);
    } else {
      filters = addAndFilter(filters, 'title', text, apiName);
    }
  }
  return filters;
};

const addAndFilter = (filters, name, datas, apiName) => {
  if (filters.length > 0) {
    if (apiName === 'kitsu') {
      return filters + '&' + `filter[${name}]=${datas}`;
    } else {
      const words = datas.split(',');
      return filters + `&${words.map((word) => `${name}=${word}`).join('&')}`;
    }
  }
  if (apiName === 'kitsu') {
    return filters + `filter[${name}]=${datas}`;
  }
  const words = datas.split(',');
  return filters + words.map((word) => `${name}=${word}`).join('&');
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

const createByIdApi = async (manhwaId, apiName) => {
  const manhwa = await findByIdApi(manhwaId);
  if (!manhwa) {
    return await getManhwa(manhwaId, apiName);
  }
  return manhwa;
};

const formatManhwa = (manhwa, apiName) => {
  if (apiName === 'kitsu') {
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
      apiName: 'kitsu',
    };
  }
  const coverArt = manhwa.relationships.find(
    (relationship) => relationship.type === 'cover_art'
  );
  const fileName = coverArt.attributes.fileName;
  return {
    id: manhwa.id,
    slug: null,
    synopsis: manhwa.attributes.description.en,
    description: manhwa.attributes.description.en,
    title: manhwa.attributes.title.en || manhwa.attributes.altTitles.en,
    title_en: manhwa.attributes.title.en,
    startDate: null,
    endDate: null,
    type: manhwa.type,
    image: `https://mangadex.org/covers/${manhwa.id}/${fileName}`,
    smallImage: `https://mangadex.org/covers/${manhwa.id}/${fileName}.256.jpg`,
    coverImage: `https://mangadex.org/covers/${manhwa.id}/${fileName}`,
    status: manhwa.attributes.status,
    apiName: 'mangadex',
  };
};

module.exports = {
  getManhwaList,
  getManhwa,
  createByIdApi,
  findAllByIdApi,
};
