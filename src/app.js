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

app.get('/api/proxy-image', (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) {
      return res.status(400).send('URL d\'image manquante');
  }
  axios({
      method: 'get',
      url: imageUrl,
      responseType: 'stream'
  }).then((response) => {
    response.data.pipe(res);
  }).catch((error) => {
      res.status(500).send('Erreur lors de la récupération de l\'image');
  });
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
