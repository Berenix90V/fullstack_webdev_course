import express from 'express'
import Note from '../models/note.js'

const notesRouter = express.Router()

notesRouter.get('/', async(request, response) => {
    const notes = await Note.find({})
    response.json(notes)
})

notesRouter.get('/:id', (request, response, next) => {
    const noteID = request.params.id
    Note.findById(noteID)
        .then(note => {
            if (note) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

notesRouter.post('/', async (request, response, next) => {
    const body = request.body

    const note = new Note({
        content: body.content,
        important: body.important || false
    })
    const savedNote = await note.save()
    response.status(201).json(savedNote)
})
notesRouter.delete('/:id', (request, response, next) => {
    const noteID = request.params.id
    Note.findByIdAndRemove(noteID)
        .then(deletedNote => {
            if (deletedNote) {
                response.status(204).end()
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
    const noteID = request.params.id
    const body = request.body
    const note = {
        content: body.content,
        important: body.important
    }
    Note.findByIdAndUpdate(noteID, note, { runValidators: true, new: true, context: 'query' })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

export default notesRouter
