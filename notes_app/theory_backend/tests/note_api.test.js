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

test('notes are returned as json', async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are two notes', async () => {
    const response = await api.get('/api/notes')

    expect(response.body).toHaveLength(helper.initialNotes.length)
})

test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')
    const contents = response.body.map(r => r.content)
    expect(contents).toContain('Browser can execute only JavaScript')

    expect(response.body[0].content).toBe('HTML is easy')
})

test('a valid note can be added', async() => {
    const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
    }
    await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialNotes.length+1)

    const contents = notesAtEnd.map(r => r.content)
    expect(contents).toContain(newNote.content)
})
test('note without content is not added', async () => {
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

test('a specific note can be viewed', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToView = notesAtStart[0]
    const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(resultNote.body).toEqual(noteToView)
})

test('a note can be deleted', async () => {
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

afterAll(async () => {
    await mongoose.connection.close()
})
