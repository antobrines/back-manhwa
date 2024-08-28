/* eslint-disable no-undef */
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT,
  db: {
    url: process.env.DB_URL,
  },
  version: process.env.VERSION,
  environment: process.env.NODE_ENV,
  url: process.env.URL,
  token: {
    secret: process.env.TOKEN_SECRET,
    expire: process.env.TOKEN_EXPIRE,
  },
  apis: {
    kitsu: process.env.API_KITSU,
    mangadex: process.env.API_MANGADEX,
  },
  deepl: {
    url: process.env.DEEPL_URL,
    authKey: process.env.DEEPL_API_KEY,
  },
  redis: {
    url: process.env.REDIS_URL,
    user: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
    port: process.env.REDIS_PORT,
  },
  mangadex: {
    username: process.env.MANGADEX_USER,
    password: process.env.MANGADEX_PASSWORD,
    client_id: process.env.MANGADEX_CLIENT_ID,
    client_secret: process.env.MANGADEX_CLIENT_SECRET,
  },
};
