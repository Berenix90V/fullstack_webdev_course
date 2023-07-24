import Note from "./components/Note";
import {useState, useEffect, useRef} from "react";
import noteServices from "./services/notes"
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import NoteForm from "./components/NoteForm";
import Togglable from "./components/Togglable";

const App = () => {
    const [notes, setNotes] = useState([])
    const [showAll, setShowAll] = useState(true)
    const [errorMessage, setErrorMessage] =  useState(null)

    const [user, setUser] = useState(null)

    const noteFormRef = useRef()

    const notesToShow = showAll? notes : notes.filter((note)=>note.important)


    useEffect(() => {
        noteServices
            .getAll()
            .then(initialNotes => {
                setNotes(initialNotes)
            })
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
        if(loggedUserJSON){
            const parsedUser = JSON.parse(loggedUserJSON)
            setUser(parsedUser)
            noteServices.setToken(parsedUser.token)
        }
    }, [])

    const login = async (username, password) => {
        const user = await loginService.login({username, password})
        window.localStorage.setItem(
            'loggedNoteappUser', JSON.stringify(user)
        )
        noteServices.setToken(user.token)
        return user
    }

    const handleLogout = async (event) => {
        event.preventDefault()
        try{
            window.localStorage.removeItem('loggedNoteappUser')
            setUser(null)
        } catch (exception) {
            setErrorMessage(exception.message)
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    const toggleImportanceOf = id => {
        const note = notes.find(note=>note.id===id)
        const changedNote = {...note, important: !note.important}
        noteServices
            .update(id, changedNote)
            .then(updatedNote => setNotes(notes.map(n=>n.id!==id?n:updatedNote)))
            .catch(error =>{
                const message = `the note '${note.content}' was already deleted from the server`
                setErrorMessage(message)
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
                setNotes(notes.filter(n=>n.id!==id))
            })
    }

    const createNote = (noteObject) => {
        noteFormRef.current.toggleVisibility()
        noteServices
            .create(noteObject)
            .then((createdNote)=>{
                setNotes(notes.concat(createdNote))
            })
    }

    const loginForm = () => {
        return (
            <Togglable buttonLabel="Log in">
                <LoginForm
                    login={login}
                    setUser={setUser}
                />
            </Togglable>
        )
    }

    return (
        <div>
            <h1>Notes</h1>
            { !user && loginForm()}
            { user && <div><p>{user.username} logged in</p> <button onClick={handleLogout}>Logout</button></div> }
            { user && <Togglable buttonLabel="new note" ref={noteFormRef}>
                <NoteForm createNote={createNote} />
            </Togglable>}
            <Notification message={errorMessage} className='error' />
            <button onClick={()=>setShowAll(!showAll)}>
                show {showAll? 'important': 'all'}
            </button>
            <ul>
                {notesToShow.map((note)=> <Note key={note.id} note={note} toggleImportance={()=>toggleImportanceOf(note.id)}/>)}
            </ul>

            <Footer />
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
