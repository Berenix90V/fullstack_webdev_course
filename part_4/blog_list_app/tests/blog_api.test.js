import app from '../app.js'
import supertest from 'supertest'
import mongoose from 'mongoose'

const api = supertest(app)

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

afterAll(async()=>{
    await mongoose.connection.close()
})