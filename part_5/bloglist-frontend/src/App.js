import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs( blogs )
        )
    }, [])

    useEffect( () => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        if(loggedUserJSON){
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
        }
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault()
        try{
            const user = await loginService.login({username, password})
            setUser(user)
            window.localStorage.setItem('loggedUser', JSON.stringify(user))
            setUsername('')
            setPassword('')
        } catch(error) {
            console.log('Login Error: ', error.message)
        }
    }

    const handleLogout = (event) => {
        event.preventDefault()
        try{
            window.localStorage.removeItem('loggedUser')
            setUser(null)
        } catch (error){
            console.log('Logout Error: ', error.message)
        }
    }

    if(user){
        return (
            <div>
            <h2>blogs</h2>
                <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>
                {blogs.map(blog =>
                    <Blog key={blog.id} blog={blog} />
                )}
            </div>
        )
    }
    else{
        return (
           <>
               <LoginForm
                   handleLogin={handleLogin} username={username} password={password}
                   setUsername={setUsername} setPassword={setPassword}
               />
           </>
        )
    }

}

export default App