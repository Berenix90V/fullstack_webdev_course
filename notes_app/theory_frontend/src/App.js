import Note from "./components/Note";
import {useState, useEffect} from "react";
import noteServices from "./services/notes"
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import NoteForm from "./components/NoteForm";

const App = () => {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('a new note...')
    const [showAll, setShowAll] = useState(true)
    const [errorMessage, setErrorMessage] =  useState(null)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    const [loginVisible, setLoginVisible] = useState(false)

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

    const handleLogin = async (event) => {
        event.preventDefault()
        console.log('logging in with', username, password)
        try{
            const user = await loginService.login({username, password})
            window.localStorage.setItem(
                'loggedNoteappUser', JSON.stringify(user)
            )
            noteServices.setToken(user.token)
            setUsername('')
            setPassword('')
            setUser(user)
        } catch (exception) {
            setErrorMessage('Wrong credentials')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    const handleLogout = async (event) => {
        event.preventDefault()
        try{
            window.localStorage.removeItem('loggedNoteappUser')
            setUsername('')
            setPassword('')
            setUser(null)
        } catch (exception) {
            setErrorMessage(exception.message)
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }
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
        noteServices
            .create(noteObject)
            .then((createdNote)=>{
                setNotes(notes.concat(createdNote))
                setNewNote('')
            })
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

    const loginForm = () => {
        const hideWhenVisible = {display: loginVisible? 'none' : ''}
        const showWhenVisible = {display: loginVisible? '' : 'none'}

        return (
            <div>
                <div style={hideWhenVisible}>
                    <button onClick={() => setLoginVisible(true)}>Log in</button>
                </div>
                <div style={showWhenVisible}>
                    <LoginForm
                        username={username}
                        password={password}
                        handleLogin={handleLogin}
                        setUsername={setUsername}
                        setPassword={setPassword}
                    />
                    <button onClick={() => setLoginVisible(false)}>cancel</button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <h1>Notes</h1>
            { !user && loginForm()}
            { user && <div><p>{user.username} logged in</p> <button onClick={handleLogout}>Logout</button></div> }
            <NoteForm user={user} newNote={newNote} handleAddNote={addNote} handleNoteChange={handleNoteChange} />
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
