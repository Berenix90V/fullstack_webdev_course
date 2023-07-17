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

afterAll(async()=>{
    await mongoose.connection.close()
})