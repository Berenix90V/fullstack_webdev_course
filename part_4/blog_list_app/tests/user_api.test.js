import app from '../app.js'
import supertest from 'supertest'
import User from '../models/user.js'
import helper from './test_helper.js'
import mongoose from "mongoose";

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
    for(const user of helper.initialUsers){
        const userObject = new User(user)
        await userObject.save()
    }
})
describe('Creation of a user', () => {
    test('succeeds when passing valid user information', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: "mluukkai",
            name: "Matti Luukkainen",
            password: "salainen"
        }
        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
        const usersIds = usersAtEnd.map(u=>u.id.toString())
        const savedUserId = response.body.id
        expect(usersIds).toContain(savedUserId)
        const savedUser = usersAtEnd.find(u=>u.id.toString() === savedUserId)
        expect(savedUser.username).toEqual(newUser.username)
        expect(savedUser.name).toEqual(newUser.name)
    })
    test('fails with invalid user', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: "ab",
            password: "salainen"
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
    test('fails with invalid password', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: "mluukkai",
            password: "sa"
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})

describe('View all users', () => {
    test('succeeds with status code 200', async () => {
        const usersInDb = await helper.usersInDb()
        const response = await api
            .get('/api/users')
            .expect(200)
        const users = response.body
        expect(users).toHaveLength(usersInDb.length)
    })
})
afterAll(async () => {
    await mongoose.connection.close()
})
