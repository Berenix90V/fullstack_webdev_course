import Note from '../models/note.js'
import User from "../models/user.js";

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

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u=>u.toJSON())
}

const helper = {
    initialNotes,
    notExistingId,
    notesInDb,
    usersInDb
}

export default helper
