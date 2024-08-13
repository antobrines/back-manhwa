const config = require('../config');
const axios = require('axios');
const Manhwa = require('../models/manhwa.model');

// ** API Service ** //
const getManhwaList = async (categories, page, limit, sort, type) => {
  const { currentLimit, currentPage, filters, currentSort } = getRequestParams(
    categories,
    page,
    limit,
    sort,
    type
  );
  const response = await axios.get(
    `${config.apiUrl}/edge/manga?${filters}&page[limit]=${currentLimit}&page[offset]=${currentPage * currentLimit}&${currentSort}`
  );
  const manhwaList = response.data.data.map(formatManhwa);
  return manhwaList;
};

const getManhwa = async (id) => {
  const response = await axios.get(`${config.apiUrl}/edge/manga/${id}`);
  const manhwa = formatManhwa(response.data.data);

  if ((await findByIdApi(id)) && manhwa) {
    await update(manhwa);
  } else {
    await create(manhwa);
  }
  return manhwa;
};

const getRequestParams = (categories, page, limit, sort, type) => {
  const currentLimit = limit || 8;
  const currentPage = page || 0;
  const currentSort = sort || 'sort=-user_count';
  const filters = getFilters(categories, type);
  return {
    currentLimit,
    currentPage,
    filters,
    currentSort,
  };
};

const getFilters = (categories, type) => {
  let filters = '';
  if (categories) {
    filters = addAndFilter(filters, 'categories', categories);
  }
  if (type) {
    filters = addAndFilter(filters, 'subtype', type);
  }
  return filters;
};

const addAndFilter = (filters, name, datas) => {
  if (filters.length > 0) {
    return filters + '&' + `filter[${name}]=${datas}`;
  }
  return filters + `filter[${name}]=${datas}`;
};

// ** Database Service ** //
const create = async (manhwa) => {
  return Manhwa.create(manhwa);
};

const findByIdApi = async (id) => {
  return Manhwa.findOne({ id });
};

const update = async (manhwa) => {
  return Manhwa.findOneAndUpdate({ id: manhwa.id }, manhwa);
};

const formatManhwa = (manhwa) => {
  return {
    id: manhwa.id,
    slug: manhwa.attributes.slug,
    synopsis: manhwa.attributes.synopsis,
    description: manhwa.attributes.description,
    title: manhwa.attributes.canonicalTitle,
    startDate: manhwa.attributes.startDate,
    endDate: manhwa.attributes.endDate,
    type: manhwa.attributes.subtype,
    image: manhwa.attributes?.posterImage?.large,
    coverImage: manhwa.attributes?.coverImage?.original,
  };
};

module.exports = {
  getManhwaList,
  getManhwa,
};
