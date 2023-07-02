import Note from "./components/Note";
import {useState} from "react";

const App = (props) => {
    const [notes, setNotes] = useState(props.notes)
    const [newNote, setNewNote] = useState('a new note...')
    const [showAll, setShowAll] = useState(true)
    const notesToShow = showAll? notes : notes.filter((note)=>note.important===true)
    const handleNoteChange = (event) => {
        setNewNote(event.target.value)
    }
    const addNote = (event)=>{
        event.preventDefault()
        const noteObject = {
            content: newNote,
            important: Math.random()<0.5,
            id: notes.length+1
        }
        setNotes(notes.concat(noteObject))
        setNewNote('')
    }
    return (
         <div>
            <h1>Notes</h1>
            <ul>
               {notesToShow.map((note)=> <Note key={note.id} note={note}/>)}
            </ul>
            <form onSubmit={addNote}>
                <input value={newNote} onChange={handleNoteChange}/>
                <button type="submit">save</button>
            </form>

         </div>
    );
}

/*
case uses for index as key in map:
1. the list and items are static–they are not computed and do not change;
2. the items in the list have no ids;
3. the list is never reordered or filtered.
 */

export default App;
