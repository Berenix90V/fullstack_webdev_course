import Note from '../models/note.js'

const initialNotes = [
    {
        content: 'HTML is easy',
        important: false,
    },
    {
        content: 'Browser can execute only JavaScript',
        important: true,
    }
]

const notExistingId = async () => {
    const note = new Note({content: 'willremovethissoon'})
    await note.save()
    await note.deleteOne()
    return note._id.toString()
}

const notesInDb = async () => {
    const notes = await Note.find({})
    return notes.map(n=>n.toJSON())
}

const helper = {
    initialNotes,
    notExistingId,
    notesInDb
}

export default helper