import React from "react";
import {toggleImportanceOf} from "./reducers/noteReducer.js";
import {useSelector, useDispatch} from "react-redux";
import NewNote from "./components/NewNote.js";
import Notes from "./components/Notes.js";


const App = () => {
  return (
      <div>
          <NewNote/>
          <Notes/>
      </div>
  )
}

export default App;
