import app from '../app.js'
import supertest from 'supertest'
import mongoose from 'mongoose'
import Blog from '../models/blog.js'
import helper from './test_helper.js'
import _ from "lodash";
import jsonwebtoken from 'jsonwebtoken'
import User from '../models/user.js'


const api = supertest(app)

beforeEach(async() => {
    await User.deleteMany({})
    for(const user of helper.initialUsers) {
        await api
            .post('/api/users')
            .send(user)
    }
    await Blog.deleteMany({})
    const initialBlogs = await helper.getInitialBlogsWithCreator()
    for(const blog of initialBlogs){
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
        const creator = await helper.blogCreator()
        const creatorToAuthenticate = {
            username: creator.username,
            id: creator.id
        }
        const validToken = jsonwebtoken.sign(creatorToAuthenticate, process.env.SECRET)
        const newBlog = {
            title: "New React patterns",
            author: "Michael Chen",
            url: "https://reactpatterns.com/",
            likes: 10
        }
        const response = await api
            .post('/api/blogs')
            .set({'Authorization': 'Bearer '+validToken})
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const blogsAtTheEnd = await helper.blogsInDb()
        expect(blogsAtTheEnd).toHaveLength(helper.initialBlogs.length+1)
        const savedBlogID = response.body.id
        const savedBlog = blogsAtTheEnd.find(blog => blog.id.toString() === savedBlogID)
        expect(savedBlog).toEqual(expect.objectContaining({
            title: newBlog.title,
            author: newBlog.author,
            url: newBlog.url,
            likes: newBlog.likes
        }))
        const savedCreatorId = savedBlog.user.toString()
        expect(savedCreatorId).toBe(creator.id)
    })

    test('fails with invalid token', async ()=> {
        const creator = await helper.blogCreator()
        const creatorToAuthenticate = {
            username: creator.username,
        }
        const validToken = jsonwebtoken.sign(creatorToAuthenticate, process.env.SECRET)
        const newBlog = {
            title: "New React patterns",
            author: "Michael Chen",
            url: "https://reactpatterns.com/",
            likes: 10,
        }
        await api
            .post('/api/blogs')
            .set({'Authorization': 'Bearer '+validToken})
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)
        const blogsAtTheEnd = await helper.blogsInDb()
        expect(blogsAtTheEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('fails with invalid token format', async ()=> {
        const validToken = 'abc'
        const newBlog = {
            title: "New React patterns",
            author: "Michael Chen",
            url: "https://reactpatterns.com/",
            likes: 10,
        }
        await api
            .post('/api/blogs')
            .set({'Authorization': 'Bearer '+validToken})
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        const blogsAtTheEnd = await helper.blogsInDb()
        expect(blogsAtTheEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('default value for likes is 0', async () => {
        const creator = await helper.blogCreator()
        const creatorToAuthenticate = {
            username: creator.username,
            id: creator.id
        }
        const validToken = jsonwebtoken.sign(creatorToAuthenticate, process.env.SECRET)
        const newBlog = {
            title: "New React patterns",
            author: "Michael Chen",
            url: "https://reactpatterns.com/",
            userId: creator.id
        }
        const response = await api
            .post('/api/blogs')
            .set({'Authorization': 'Bearer '+validToken})
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const savedBlog = response.body
        expect(savedBlog.likes).toBe(0)
    })

    test('not valid blog is not added (url missing)', async () => {
        const creator = await helper.blogCreator()
        const creatorToAuthenticate = {
            username: creator.username,
            id: creator.id
        }
        const validToken = jsonwebtoken.sign(creatorToAuthenticate, process.env.SECRET)
        const newBlog = {
            title: "New React patterns",
            author: "Michael Chen",
            likes: 12,
            userId: creator.id
        }
        await api
            .post('/api/blogs')
            .set({Authorization: 'Bearer '+validToken})
            .send(newBlog)
            .expect(400)
    })

    test('not valid blog is not added (title missing)', async () => {
        const creator = await helper.blogCreator()
        const creatorToAuthenticate = {
            username: creator.username,
            id: creator.id
        }
        const validToken = jsonwebtoken.sign(creatorToAuthenticate, process.env.SECRET)
        const newBlog = {
            author: "Michael Chen",
            url: "https://reactpatterns.com/",
            likes: 12,
            userId: creator.id
        }
        await api
            .post('/api/blogs')
            .set({Authorization: 'Bearer '+validToken})
            .send(newBlog)
            .expect(400)
    })
})

// describe('deletion of a blog', () => {
//     test('succeeds with status code 204 if deleted by the creator', async () => {
//         const blogsAtStart = await helper.blogsInDb()
//         const blogToDelete = blogsAtStart[0]
//         const creator = await User.findById(blogToDelete.user)
//         const creatorToAuthenticate = {
//             username: creator.username,
//             id: creator._id
//         }
//         const validToken = jsonwebtoken.sign(creatorToAuthenticate, process.env.SECRET)
//         await api
//             .delete(`/api/blogs/${blogToDelete.id}`)
//             .set({'Authorization': 'Bearer '+validToken})
//             .expect(204)
//         const blogsAtEnd = await helper.blogsInDb()
//         expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
//         const blogsIds = blogsAtEnd.map(b => b.id)
//         expect(blogsIds).not.toContain(blogToDelete.id)
//     })
//     test('fails with status code 401 if malformed token', async () => {
//         const blogsAtStart = await helper.blogsInDb()
//         const blogToDelete = blogsAtStart[0]
//         const creator = await helper.blogCreator()
//         const creatorToAuthenticate = {
//             username: creator.username,
//         }
//         const validToken = jsonwebtoken.sign(creatorToAuthenticate, process.env.SECRET)
//         await api
//             .delete(`/api/blogs/${blogToDelete.id}`)
//             .set({'Authorization': 'Bearer '+validToken})
//             .expect(401)
//         const blogsAtEnd = await helper.blogsInDb()
//         expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
//     })
//     test('fails with status code 400 if not valid token', async () => {
//         const blogsAtStart = await helper.blogsInDb()
//         const blogToDelete = blogsAtStart[0]
//         const validToken = 'abc'
//         await api
//             .delete(`/api/blogs/${blogToDelete.id}`)
//             .set({'Authorization': 'Bearer '+validToken})
//             .expect(400)
//         const blogsAtEnd = await helper.blogsInDb()
//         expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
//     })
// })

// describe('update of a blog', () => {
//     test('succeeds with status code 200 if id is valid', async () => {
//         const blogsAtStart = await helper.blogsInDb()
//         const blogToUpdate = blogsAtStart[0]
//         const newBlog = {
//             title: blogToUpdate.title,
//             author: blogToUpdate.author,
//             url: blogToUpdate.url,
//             likes: blogToUpdate.likes + 1,
//             user: blogToUpdate.user
//         }
//          await api
//             .put(`/api/blogs/${blogToUpdate.id}`)
//              .send(newBlog)
//             .expect(200)
//             .expect('Content-Type', /application\/json/)
//         const updatedBlogInDb = await Blog.findById(blogToUpdate.id)
//         expect(updatedBlogInDb).toEqual(expect.objectContaining(newBlog))
//     })
//     test('fails with status code 404 if id is not existent', async () => {
//         const blogsAtStart = await helper.blogsInDb()
//         const blogToUpdate = blogsAtStart[0]
//         const newBlog = {
//             title: blogToUpdate.title,
//             author: blogToUpdate.author,
//             url: blogToUpdate.url,
//             likes: blogToUpdate.likes + 1,
//             user: blogToUpdate.user
//         }
//         const blogIdNotExisting = await helper.blogIdNotExisting()
//         await api
//             .put(`/api/blogs/${blogIdNotExisting}`)
//             .send(newBlog)
//             .expect(404)
//     })
//     test('fails with status code 400 if id is not existent', async () => {
//         const blogsAtStart = await helper.blogsInDb()
//         const blogToUpdate = blogsAtStart[0]
//         const newBlog = {
//             title: blogToUpdate.title,
//             author: blogToUpdate.author,
//             url: blogToUpdate.url,
//             likes: blogToUpdate.likes + 1,
//             user: blogToUpdate.user
//         }
//         const blogIdNotValid = '12344'
//         await api
//             .put(`/api/blogs/${blogIdNotValid}`)
//             .send(newBlog)
//             .expect(400)
//     })
// })

afterAll(async()=>{
    await mongoose.connection.close()
})