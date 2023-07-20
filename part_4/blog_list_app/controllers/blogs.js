import express from 'express'
import Blog from "../models/blog.js";
import User from "../models/user.js";

const blogsRouter = express.Router()
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = response.body
    const user = User.findById(request.body.userId)
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog)
    await user.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const blogId = request.params.id
    await Blog.findByIdAndDelete(blogId)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const blogId = request.params.id
    const body = request.body
    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
    const updatedBlog = await Blog.findByIdAndUpdate(blogId, blog, { runValidators: true, new: true, context: 'query'})
    if(updatedBlog){
        response.status(200).send(updatedBlog)
    } else {
        response.status(404).end()
    }

})

export default blogsRouter
