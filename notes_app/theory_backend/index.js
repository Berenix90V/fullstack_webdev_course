import app from './app.js'
import config from './utils/config.js'
import logger from './utils/logger.js'

logger.info(config)
app.listen(config.port, () => {
    logger.info(`Server listening on the port ${config.port}`)
})
