import express from 'express'
import Blog from "../models/blog.js";

const blogsRouter = express.Router()
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    const result = await blog.save()
    response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
    const blogId = request.params.id
    await Blog.findByIdAndDelete(blogId)
    response.status(204).end()
})

export default blogsRouter
