import config from './utils/config.js'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import Blog from "./models/blog.js";

const app = express()

mongoose.connect(config.mongodb_url)

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

app.post('/api/blogs', (request, response) => {
    const blog = new Blog(request.body)
    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})

export default app