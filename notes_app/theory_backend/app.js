import 'dotenv/config'
import express from 'express'
import 'express-async-errors'
import cors from 'cors'
import notesRouter from './controllers/notes.js'
import userRouter from './controllers/users.js'
import loginRouter from './controllers/login.js'
import mongoose from 'mongoose'
import config from './utils/config.js'
import logger from './utils/logger.js'
import middleware from './utils/middleware.js'

const app = express()

mongoose.set('strictQuery', false)

logger.info('connecting to', config.mongodb_url)

mongoose.connect(config.mongodb_url)
    .then(result => {
        logger.info('Connected to MongoDB')
    })
    .catch((error) => {
        logger.info('Error connecting to Mongo', error.message)
    })

// Middleware
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.use(middleware.unknownEndPoint)
app.use(middleware.errorHandler)

export default app
