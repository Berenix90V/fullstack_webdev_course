import app from '../app.js'
import supertest from 'supertest'
import mongoose from 'mongoose'
import Blog from '../models/blog.js'
import helper from './test_helper.js'
import _ from "lodash";


const api = supertest(app)

beforeEach(async() => {
    await Blog.deleteMany({})
    for(const blog of helper.initialBlogs){
        const blogObject = new Blog(blog)
        await blogObject.save()
    }
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('verify existence of unique property id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    for(const blog of blogs){
        expect(blog.id).toBeDefined()
    }
    const ids = _.countBy(blogs,blog=>blog.id)
    for(const key in ids){
        expect(ids[key]).toBe(1)
    }
    expect(Object.keys(ids).length).toBe(blogs.length)


})

test('it is possible to add a blog', async ()=> {
    const newBlog = {
        title: "New React patterns",
        author: "Michael Chen",
        url: "https://reactpatterns.com/",
        likes: 10
    }
    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    const blogsAtTheEnd = await helper.blogsInDb()
    expect(blogsAtTheEnd).toHaveLength(helper.initialBlogs.length+1)
    const savedBlogID = response.body.id
    const savedBlog = blogsAtTheEnd.find(blog => blog.id.toString() === savedBlogID)
    expect(savedBlog).toEqual(expect.objectContaining(newBlog))
})

afterAll(async()=>{
    await mongoose.connection.close()
})