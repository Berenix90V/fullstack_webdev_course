import React from "react";
import {createNote, toggleImportanceOf} from "./reducers/noteReducer.js";
import {useSelector, useDispatch} from "react-redux";
import NewNote from "./components/NewNote.js";


const App = () => {
  const dispatch = useDispatch()
  const notes = useSelector(state => state)

  const toggleImportance = (id) => {
    dispatch(toggleImportanceOf(id))
  }

  return (
      <div>
          <NewNote/>
        <ul>
          {notes.map(note =>
              <li
                  key={note.id}
                  onClick={() => toggleImportance(note.id)}
              >
                {note.content} <strong>{note.important ? 'important' : ''}</strong>
              </li>
          )}
        </ul>
      </div>
  )
}

export default App;
