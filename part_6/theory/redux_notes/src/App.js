import React, {useEffect} from "react";
import NewNote from "./components/NewNote.js";
import Notes from "./components/Notes.js";
import VisibilityFilter from "./components/VisibilityFilter.js";
import {useDispatch} from "react-redux";
import noteServices from "./services/notes.js";
import {setNotes} from "./reducers/noteReducer.js";

const App = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        noteServices
            .getAll().then(notes => dispatch(setNotes(notes)))
    }, [dispatch])
    return (
        <div>
            <NewNote/>
            <VisibilityFilter/>
            <Notes/>
        </div>
    )
}

export default App;
