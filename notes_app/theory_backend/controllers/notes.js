import express from 'express'
import Note from '../models/note.js'

const notesRouter = express.Router()

notesRouter.get('/', async(request, response) => {
    const notes = await Note.find({})
    response.json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {
    const noteID = request.params.id
    try{
        const note = await Note.findById(noteID)
        if (note) {
            response.json(note)
        } else {
            response.status(404).end()
        }
    } catch(exception){
        next(exception)
    }
})

notesRouter.post('/', async (request, response, next) => {
    const body = request.body

    const note = new Note({
        content: body.content,
        important: body.important || false
    })
    try{
        const savedNote = await note.save()
        response.status(201).json(savedNote)
    } catch (exception) {
        next(exception)
    }

})
notesRouter.delete('/:id', async (request, response, next) => {
    const noteID = request.params.id
    try{
        const deletedNote = await Note.findByIdAndRemove(noteID)
        if (deletedNote) {
            response.status(204).end()
        } else {
            response.status(404).end()
        }
    } catch(exception){
        next(exception)
    }
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
