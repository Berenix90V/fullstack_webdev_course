import Note from "./components/Note";
import {useState, useEffect} from "react";
import axios from "axios";

const App = () => {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('a new note...')
    const [showAll, setShowAll] = useState(true)
    const notesToShow = showAll? notes : notes.filter((note)=>note.important)

    useEffect(() => {
        axios
            .get('http://localhost:3001/notes')
            .then(response => {
                setNotes(response.data)
            })
    }, [])
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
        axios
            .post("http://localhost:3001/notes", noteObject)
            .then((response)=>{
                console.log(response)
                setNotes(notes.concat(noteObject))
                setNewNote('')
            })
    }
    const toggleImportanceOf = id => {
        const url = `http://localhost:3001/notes/${id}`
        const note = notes.find(note=>note.id===id)
        const changedNote = {...note, important: !note.important}
        axios
            .put(url, changedNote)
            .then(response => setNotes(notes.map(n=>n.id!==id?n:response.data)))
    }
    return (
        <div>
            <h1>Notes</h1>
            <button onClick={()=>setShowAll(!showAll)}>
                show {showAll? 'important': 'all'}
            </button>
            <ul>
                {notesToShow.map((note)=> <Note key={note.id} note={note} toggleImportance={()=>toggleImportanceOf(note.id)}/>)}
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
