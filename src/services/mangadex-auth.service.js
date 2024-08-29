const axios = require('axios');
const redis = require('redis');
const config = require('../config');
const qs = require('querystring');
const { jwtDecode } = require('jwt-decode');

const connectRedis = async () => {
  const client = await redis
    .createClient({
      user: config.redis.user,
      password: config.redis.password,
      socket: {
        host: config.redis.url,
        port: config.redis.port,
        tls: false,
      },
    })
    .connect();

  return client;
};

const mangaDexApiLogin = async () => {
  const data = qs.stringify({
    grant_type: 'password',
    username: config.mangadex.username,
    password: config.mangadex.password,
    client_id: config.mangadex.client_id,
    client_secret: config.mangadex.client_secret,
  });
  const resp = await axios({
    method: 'POST',
    url: `https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token`,
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  const { access_token, refresh_token } = resp.data;

  const client = await connectRedis();
  client.set('mangadex_access_token', access_token);
  client.set('mangadex_refresh_token', refresh_token);
  client.quit();
  return { access_token, refresh_token };
};

const getMangaDexAccessToken = async () => {
  const client = await connectRedis();
  let currentAccessToken = await client.get('mangadex_access_token');
  const exp = jwtDecode(currentAccessToken).exp;
  const now = Date.now() / 1000;
  if (exp - now < 60) {
    const refreshToken = await client.get('mangadex_refresh_token');
    const data = qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: config.mangadex.client_id,
      client_secret: config.mangadex.client_secret,
    });
    const resp = await axios({
      method: 'POST',
      url: `https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token`,
      data: data,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const { access_token, refresh_token } = resp.data;
    client.set('mangadex_access_token', access_token);
    client.set('mangadex_refresh_token', refresh_token);
    client.quit();
    currentAccessToken = access_token;
  }
  return currentAccessToken;
};

module.exports = {
  mangaDexApiLogin,
  getMangaDexAccessToken,
};
