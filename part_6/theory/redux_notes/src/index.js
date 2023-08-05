import React from 'react';
import ReactDOM from 'react-dom/client';
import{configureStore} from '@reduxjs/toolkit'
import {Provider} from "react-redux";
import App from './App.js'
import noteReducer from "./reducers/noteReducer.js";
import filterReducer from "./reducers/filterReducer.js";

const store = configureStore({
    reducer: {
        notes: noteReducer,
        filter: filterReducer
    }
})

console.log(store.getState())

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () =>{
    root.render(<Provider store={store}><App/></Provider>)
}

renderApp()

store.subscribe(renderApp)
