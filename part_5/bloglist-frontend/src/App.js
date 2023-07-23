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

    const handleLogin = async (event) => {
        event.preventDefault()
        try{
            const user = await loginService.login({username, password})
            setUser(user)
            setUsername('')
            setPassword('')
        } catch(error) {
            console.log('Error: ', error.message)
        }
    }

    if(user){
        return (
            <div>
            <h2>blogs</h2>
                <p>{user.name} logged in</p>
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