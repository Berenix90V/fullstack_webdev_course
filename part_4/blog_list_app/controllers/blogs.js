import express from 'express'
import Blog from "../models/blog.js";
import User from "../models/user.js";
import jsonwebtoken from "jsonwebtoken";

const blogsRouter = express.Router()
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const currentUserId = request.user
    if(!currentUserId){
        return response.status(401).json({error: 'invalid token'})
    }
    const user = await User.findById(currentUserId)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    const blogId = request.params.id
    const currentUserId = request.user
    const blogToDelete = await Blog.findById(blogId)
    const creator = await User.findById(blogToDelete.user)

    if(!currentUserId){
        return response.status(401).json({error: 'invalid token'})
    }
    if(!(currentUserId === creator.id.toString())){
        return response.status(401).json({error: 'user not authorized to delete the blog'})
    }
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
        likes: body.likes,
        user: body.user._id
    }
    const updatedBlog = await Blog.findByIdAndUpdate(blogId, blog, { runValidators: true, new: true, context: 'query'}).populate('user', {username: 1, name: 1})
    if(updatedBlog){
        response.status(200).send(updatedBlog)
    } else {
        response.status(404).end()
    }

})

export default blogsRouter
