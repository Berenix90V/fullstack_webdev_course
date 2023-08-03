import React from 'react';
import ReactDOM from 'react-dom/client';
import {combineReducers, createStore} from "redux";
import {Provider} from "react-redux";
import App from './App.js'
import noteReducer, {createNote} from "./reducers/noteReducer.js";
import filterReducer, {filterChange} from "./reducers/filterReducer.js";


const reducer = combineReducers({
    notes: noteReducer,
    filter: filterReducer
})
const store = createStore(reducer)
console.log(store.getState())

const root = ReactDOM.createRoot(document.getElementById('root'))

// const renderApp = () =>{
//     root.render(<Provider store={store}><App/></Provider>)
// }

const renderApp = () =>{
    root.render(<Provider store={store}><div/></Provider>)
}

renderApp()

store.subscribe(renderApp)

