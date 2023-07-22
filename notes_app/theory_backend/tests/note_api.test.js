import mongoose from 'mongoose'
import supertest from 'supertest'
import helper from './test_helper.js'
import app from '../app.js'
import Note from '../models/note.js'

const api=supertest(app)

beforeEach(async() => {
    await Note.deleteMany({})
    for(let note of helper.initialNotes){
        let noteObject = new Note(note)
        await noteObject.save()
    }
})

describe('when there is initially some notes saved', () => {
    test('notes are returned as json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    test('all notes are returned', async () => {
        const response = await api.get('/api/notes')

        expect(response.body).toHaveLength(helper.initialNotes.length)
    })
    test('a specific note is within the returned notes', async () => {
        const response = await api.get('/api/notes')
        const contents = response.body.map(r => r.content)
        expect(contents).toContain('Browser can execute only JavaScript')

        expect(response.body[0].content).toBe('HTML is easy')
    })
})

describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
        const notesAtStart = await helper.notesInDb()
        const noteToView = notesAtStart[0]
        const resultNote = await api
            .get(`/api/notes/${noteToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(resultNote.body).toEqual(noteToView)
    })
    test('fails with statuscode 404 if note does not exist', async () => {
        const validNotExistingId = await helper.notExistingId()
        await api
            .get(`/api/notes/${validNotExistingId}`)
            .expect(404)
    })
    test('fails with statuscode 400 if id not valid', async () => {
        const invalidId = '5a3d5da59070081a82a3445'
        await api
            .get(`/api/notes/${invalidId}`)
            .expect(400)
    })
})

describe('addition of a new note', () => {
    it('succeeds with valid data', async() => {
        const users = await helper.usersInDb()
        const validUser = users[0]

        const loginUser = {
            username: validUser.username,
            password: "sekret"
        }
        const response = await api
            .post('/api/login')
            .send(loginUser)
            .expect(200)
        const token = response.body.token

        const newNote = {
            content: 'async/await simplifies making async calls',
            important: true,
            userId: validUser._id
        }
        await api
            .post('/api/notes')
            .set({"Authorization": "Bearer "+token})
            .send(newNote)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const notesAtEnd = await helper.notesInDb()
        expect(notesAtEnd).toHaveLength(helper.initialNotes.length+1)

        const contents = notesAtEnd.map(r => r.content)
        expect(contents).toContain(newNote.content)
    })

    it('fails with status code 400 if data invalid', async () => {
        const newNote = {
            important: true
        }
        await api
            .post('/api/notes')
            .send(newNote)
            .expect(400)
        const notesAtEnd = await helper.notesInDb()

        expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
    })
})

describe('deletion of a note', () => {
    test('success with status code 204 if id is valid', async () => {
        const notesAtStart = await helper.notesInDb()
        const noteToDelete = notesAtStart[0]
        await api
            .del(`/api/notes/${noteToDelete.id}`)
            .expect(204)
        const notesAtEnd = await helper.notesInDb()
        expect(notesAtEnd).toHaveLength(notesAtStart.length-1)

        const contents = notesAtEnd.map(n => n.content)
        expect(contents).not.toContain(noteToDelete.content)

        const ids = notesAtEnd.map(n => n.id)
        expect(ids).not.toContain(noteToDelete.id)
    })
})


afterAll(async () => {
    await mongoose.connection.close()
})
