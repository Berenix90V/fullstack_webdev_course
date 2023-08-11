import React from "react";
import {
    BrowserRouter as Router,
    Link, Route, Routes
} from "react-router-dom";

const Home = () => (
    <div>
        <h2>TKTL notes app</h2>
        <div>
            Lorem ipsum
        </div>
    </div>
)

const Notes = () => (
    <div>
        <h2>Notes</h2>
        <div>
            <ul>
                <li>HTML is easy</li>
                <li>Browser can execute javascript</li>
                <li>Browser talks to server with HTML</li>
            </ul>
        </div>
    </div>
)

const Users = () => (
    <div>
        <h2>Users</h2>
        Users
    </div>
)

const App = () => {
    const padding = {
        padding:5
    }

    return (
        <Router>
            <div>
                <Link style={padding} to="/">home</Link>
                <Link style={padding} to="/notes">notes</Link>
                <Link style={padding} to="/users">users</Link>
            </div>
            <Routes>
                <Route path="/notes" element={<Notes/>}/>
                <Route path="/users" element={<Users/>}/>
                <Route path="/" element={<Home/>}/>
            </Routes>
        </Router>
    )

}

export default App