import {useDispatch, useSelector} from "react-redux";
import {toggleImportanceOf} from "../reducers/noteReducer.js";

const Note = ({note, handleClick}) => {
    return (
        <li onClick={handleClick} >
            {note.content}
            <strong>{note.important? 'important' : ''}</strong>
        </li>
    )
}
const Notes = () => {
    const dispatch = useDispatch()
    const notes = useSelector(state => {
        switch(state.filter){
            case 'ALL':
                return state.notes
            case 'IMPORTANT':
                return state.notes.filter(note=>note.important)
            case 'NONIMPORTANT':
                return state.notes.filter(note=>!note.important)
            default:
                return state.notes
        }
    })
    return(
        <ul>
            {notes.map(note =>
                <Note
                    note={note}
                    handleClick={() => dispatch(toggleImportanceOf(note.id))}
                    key={note.id}
                />)}
        </ul>
    )
}

export default Notes