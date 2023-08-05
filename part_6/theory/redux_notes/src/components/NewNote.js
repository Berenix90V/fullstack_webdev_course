import {useDispatch} from "react-redux";
import {createNote} from "../reducers/noteReducer.js";
import noteServices from "../services/notes.js";

const NewNote = () => {
    const dispatch = useDispatch()

    const addNote = async (event) => {
        event.preventDefault()
        const content = event.target.note.value
        event.target.note.value = ''
        const newNote = await noteServices.createNew(content)
        dispatch(createNote(newNote))
    }

    return (
        <form onSubmit={addNote}>
            <input name="note"/>
            <button type="submit">add</button>
        </form>
    )
}

export default NewNote
