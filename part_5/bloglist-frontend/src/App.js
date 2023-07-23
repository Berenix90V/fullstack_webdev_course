import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import AddNewBlogForm from "./components/AddNewBlogForm";

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

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
            blogService.setToken(user.token)
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
            blogService.setToken(null)
        } catch (error){
            console.log('Logout Error: ', error.message)
        }
    }
    const addNewBlog = (event) => {
        event.preventDefault()
        console.log('submitted blog with title ', title)
    }

    if(user){
        return (
            <div>
            <h2>blogs</h2>
                <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>
                <AddNewBlogForm handleAddNewBlog={addNewBlog}
                                title={title} setTitle={setTitle}
                                author={author} setAuthor={setAuthor}
                                url={url} setUrl={setUrl}
                />
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