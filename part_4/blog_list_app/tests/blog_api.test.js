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

describe('view all blogs', () => {
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
})


describe('creation of a blog', () => {
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

    test('default value for likes is 0', async () => {
        const newBlog = {
            title: "New React patterns",
            author: "Michael Chen",
            url: "https://reactpatterns.com/",
        }
        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const savedBlog = response.body
        expect(savedBlog.likes).toBe(0)
    })

    test('not valid blog is not added (url missing)', async () => {
        const newBlog = {
            title: "New React patterns",
            author: "Michael Chen",
            likes: 12
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })

    test('not valid blog is not added (title missing)', async () => {
        const newBlog = {
            author: "Michael Chen",
            url: "https://reactpatterns.com/",
            likes: 12
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })
})

describe('deletion of a blog', () => {
    test('succeeds with status code 204', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
        const blogsIds = blogsAtEnd.map(b => b.id)
        expect(blogsIds).not.toContain(blogToDelete.id)
    })
})

describe('update of a blog', () => {
    test('succeeds with status code 200 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const newBlog = {
            title: blogToUpdate.title,
            author: blogToUpdate.author,
            url: blogToUpdate.url,
            likes: blogToUpdate.likes + 1
        }
         await api
            .put(`/api/blogs/${blogToUpdate.id}`)
             .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const updatedBlogInDb = await Blog.findById(blogToUpdate.id)
        expect(updatedBlogInDb).toEqual(expect.objectContaining(newBlog))
    })
    test('fails with status code 404 if id is not existent', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const newBlog = {
            title: blogToUpdate.title,
            author: blogToUpdate.author,
            url: blogToUpdate.url,
            likes: blogToUpdate.likes + 1
        }
        const blogIdNotExisting = await helper.idNotExisting()
        await api
            .put(`/api/blogs/${blogIdNotExisting}`)
            .send(newBlog)
            .expect(404)
    })
    test('fails with status code 400 if id is not existent', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const newBlog = {
            title: blogToUpdate.title,
            author: blogToUpdate.author,
            url: blogToUpdate.url,
            likes: blogToUpdate.likes + 1
        }
        const blogIdNotValid = '12344'
        await api
            .put(`/api/blogs/${blogIdNotValid}`)
            .send(newBlog)
            .expect(400)
    })
})


afterAll(async()=>{
    await mongoose.connection.close()
})