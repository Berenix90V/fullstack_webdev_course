import config from './utils/config.js'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import blogsRouter from './controllers/blogs.js'

const app = express()

mongoose.connect(config.mongodb_url)

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)

export default app
