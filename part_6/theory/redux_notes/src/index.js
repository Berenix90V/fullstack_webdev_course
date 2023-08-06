import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from "react-redux";
import App from './App.js'
import store from "./config/store.js";


const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () =>{
    root.render(<Provider store={store}><App/></Provider>)
}

renderApp()

store.subscribe(renderApp)
