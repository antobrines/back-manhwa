const app = require('./app')
const config = require('./config/index')
const mongoose = require('mongoose')
const port = config.port || 3000
const { createLogger } = require('./utils/log')
const logger = createLogger('app')

mongoose.set('strictQuery', true)
mongoose.connect(`${config.db.url}`).then(() => {
  logger.info('Connected to database')
  app.listen(config.port, () => {
    logger.info(`Server running on ${config.url}:${port}`)
  })
})
