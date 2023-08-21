import app from '../app.js'
import supertest from 'supertest'
import helper from './test_helper.js'
import User from '../models/user.js'
import mongoose from 'mongoose'

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
    const users = helper.initialUsers
    for (const user of users) {
        await api.post('/api/users').send(user)
    }
})
describe('Login authentication', () => {
    test('succeeds with valid username and password', async () => {
        const validUser = helper.initialUsers[0]
        const response = await api
            .post('/api/login')
            .send(validUser)
            .expect(200)
        expect(response.body).toHaveProperty('token')
    })
    test('fails with invalid username', async () => {
        const validUser = helper.initialUsers[0]
        const invalidUser = {
            username: 'new user',
            password: validUser.password,
        }
        await api.post('/api/login').send(invalidUser).expect(401)
    })
    test('fails with invalid password', async () => {
        const validUser = helper.initialUsers[0]
        const invalidUser = {
            username: validUser.username,
            password: 'test',
        }
        const response = await api
            .post('/api/login')
            .send(invalidUser)
            .expect(401)
    })
})
afterAll(async () => {
    await mongoose.connection.close()
})
