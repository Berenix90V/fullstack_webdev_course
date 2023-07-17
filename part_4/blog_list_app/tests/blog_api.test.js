import app from '../app.js'
import supertest from 'supertest'
import mongoose from 'mongoose'
import Blog from '../models/blog.js'
import helper from './test_helper.js'

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

afterAll(async()=>{
    await mongoose.connection.close()
})