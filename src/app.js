const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const httpStatus = require('http-status');
const app = express();
const { errorF } = require('./utils/message');
const routes = require('./routes');
const { createLogger } = require('./utils/log');
const logger = createLogger();
const axios = require('axios');
const sharp = require('sharp');

const memoryCache = new Map();

app.set('trust proxy', 1);
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`${req.method} - ${req.url}`, { body: req.body });
  next();
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError) {
    errorF(error.message, error, 500, res);
  } else {
    next();
  }
});

app.use('/api', routes);

// Routes to test the API
app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄👨‍🔧🐱‍🚀✌',
  });
});

// setup a proxy to fetch images
app.get('/api/proxy-image', async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) {
    return res.status(400).send("URL d'image manquante");
  }

  try {
    if (memoryCache.has(imageUrl)) {
      console.log('Image from cache');
      const cachedImage = memoryCache.get(imageUrl);
      res.setHeader('Content-Type', cachedImage.contentType);
      const buffer = Buffer.from(cachedImage.data, 'base64');
      return res.send(buffer);
    }

    const response = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'arraybuffer',
    });

    const resizedImageBuffer = await sharp(response.data)
      .resize(284, 402)
      .toBuffer();
    
    const imageData = resizedImageBuffer.toString('base64');
    memoryCache.set(imageUrl, {
      contentType: response.headers['content-type'],
      data: imageData,
    });
    console.log('Image from API');
    res.setHeader('Content-Type', response.headers['content-type']);
    res.send(resizedImageBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la récupération de l'image");
  }
});

// Error handling not found
app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND);
  const errorMessage = {
    message: `🔍 - Not Found - ${req.originalUrl}`,
  };
  res.json(errorMessage);
  next();
});

module.exports = app;
