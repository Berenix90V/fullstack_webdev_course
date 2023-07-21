import config from './utils/config.js'
import express from 'express'
import 'express-async-errors'
import cors from 'cors'
import mongoose from 'mongoose'
import middleware from './utils/middleware.js'
import blogsRouter from './controllers/blogs.js'
import usersRouter from './controllers/users.js'
import loginRouter from './controllers/login.js'


const app = express()

mongoose.connect(config.mongodb_url)

app.use(cors())
app.use(express.json())

app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.errorHandler)

export default app
