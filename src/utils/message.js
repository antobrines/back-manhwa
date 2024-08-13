const responses = require('../models/responses');
const config = require('../config/index');

const errorF = (message, error, code, res) => {
  res.status(code);
  if (config.environment == 'production') {
    res.json(new responses(message, {}));
  } else {
    res.json(new responses(message, `${error}`));
  }
};

const successF = (message, body, code, res) => {
  res.status(code);
  res.json(new responses(message, body));
};

module.exports = {
  errorF,
  successF,
};
