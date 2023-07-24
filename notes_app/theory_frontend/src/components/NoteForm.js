import {useState} from "react";
const NoteForm = ({createNote}) => {
    const [newNote, setNewNote] = useState('')

    const addNote = (event)=>{
        event.preventDefault()
        const noteObject = {
            content: newNote,
            important: true
        }
        createNote(noteObject)
        setNewNote('')
    }
    return (
        <form onSubmit={addNote}>
            <input value={newNote} onChange={(event) => setNewNote(event.target.value)}/>
            <button type="submit">save</button>
        </form>
    )

}

export default NoteForm