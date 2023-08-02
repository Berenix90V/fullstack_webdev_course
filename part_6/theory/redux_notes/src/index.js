import React from 'react';
import ReactDOM from 'react-dom/client';
import {createStore} from "redux";

import {Provider} from "react-redux";

import App from './App.js'
import noteReducer from "./reducers/noteReducer.js";

const store = createStore(noteReducer)

store.dispatch({
    type: 'NEW_NOTE',
    payload: {
        content: 'the app state is in redux store',
        important: true,
        id: 1
    }
})

store.dispatch({
    type: 'NEW_NOTE',
    payload: {
        content: 'state changes are made with actions',
        important: false,
        id: 2
    }
})


const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () =>{
    root.render(<Provider store={store}><App/></Provider>)
}

renderApp()

store.subscribe(renderApp)