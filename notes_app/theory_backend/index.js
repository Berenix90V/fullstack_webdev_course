import app from './app.js'
import config from './utils/config'
import logger from './utils/logger.js'

app.listen(config.PORT, () => {
    logger.info(`Server listening on the port ${config.PORT}`)
})
