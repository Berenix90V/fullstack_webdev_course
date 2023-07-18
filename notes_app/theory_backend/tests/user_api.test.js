import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
import bcrypt from 'bcrypt'
import User from '../models/user.js'
import helper from "./test_helper.js";

const api = supertest(app)
describe('when there is initially one user in the db', () => {
    beforeEach(async()=>{
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({
            username: 'root',
            passwordHash: passwordHash
        })
        await user.save()
    })
    test('creation succeeds with a fresh username', async () => {
        const userAtStart = await helper.usersInDb()
        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const userAtEnd = await helper.usersInDb()
        expect(userAtEnd).toHaveLength(userAtStart.length+1)

        const userNames = userAtEnd.map(u => u.username)
        expect(userNames).toContain(newUser.username)
    })
    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen'
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(result.body.error).toContain('expected `username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
    })
})
afterAll(async () => {
    await mongoose.connection.close()
})
