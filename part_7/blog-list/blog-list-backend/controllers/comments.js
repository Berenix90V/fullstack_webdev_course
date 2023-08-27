import express from 'express'
import Comment from '../models/comment.js'

const commentsRouter = express.Router()

commentsRouter.get('/', async (request, response) => {
    const comments = await Comment.find({}).populate('blog', {
        title: true,
        author: true
    })
    response.json(comments)
})


