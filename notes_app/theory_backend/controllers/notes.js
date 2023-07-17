import express from 'express'
import Note from '../models/note.js'

const notesRouter = express.Router()

notesRouter.get('/', async(request, response) => {
    const notes = await Note.find({})
    response.json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {
    const noteID = request.params.id
    const note = await Note.findById(noteID)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

notesRouter.post('/', async (request, response) => {
    const body = request.body

    const note = new Note({
        content: body.content,
        important: body.important || false
    })
    const savedNote = await note.save()
    response.status(201).json(savedNote)
})
notesRouter.delete('/:id', async (request, response) => {
    const noteID = request.params.id
    const deletedNote = await Note.findByIdAndRemove(noteID)
    if (deletedNote) {
        response.status(204).end()
    } else {
        response.status(404).end()
    }

})

notesRouter.put('/:id', (request, response) => {
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
