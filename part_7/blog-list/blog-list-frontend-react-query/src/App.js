import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import AddNewBlogForm from './components/AddNewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    const [notification, setNotification] = useState('')
    const [notificationType, setNotificationType] = useState('')

    const blogFormRef = useRef()

    useEffect(() => {
        const getBlogs = async () => {
            const allBlogs = await blogService.getAll()
            allBlogs.sort((a, b) => b.likes - a.likes)
            if (allBlogs.length > 0) {
                setBlogs(allBlogs)
            }
        }
        getBlogs()
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({ username, password })
            setUser(user)
            blogService.setToken(user.token)
            window.localStorage.setItem('loggedUser', JSON.stringify(user))
            setUsername('')
            setPassword('')
        } catch (error) {
            setNotification('Invalid user or password')
            setNotificationType('error')
            setTimeout(() => {
                setNotification('')
                setNotificationType('')
            }, 5000)
            console.log('Login Error: ', error.message)
        }
    }

    const handleLogout = (event) => {
        event.preventDefault()
        try {
            window.localStorage.removeItem('loggedUser')
            setUser(null)
            blogService.setToken(null)
        } catch (error) {
            console.log('Logout Error: ', error.message)
        }
    }
    const addNewBlog = async (blogObject) => {
        blogFormRef.current.toggleVisibility()
        const createdBlog = await blogService.create(blogObject)
        if (createdBlog) {
            console.log(createdBlog)
            const updatedBlogs = await blogService.getAll()
            setBlogs(updatedBlogs)
            setNotification(
                `A new blog is created: ${createdBlog.title} by ${createdBlog.author}`,
            )
            setNotificationType('success')
            setTimeout(() => {
                setNotification('')
                setNotificationType('')
            }, 5000)
        }
    }

    const updateBlog = async (blogObject) => {
        try {
            await blogService.update(blogObject)
            const updatedBlogs = await blogService.getAll()
            updatedBlogs.sort((a, b) => b.likes - a.likes)
            setBlogs(updatedBlogs)
        } catch (error) {
            console.log(error.message)
        }
    }

    const removeBlog = async (blogId) => {
        try {
            await blogService.remove(blogId)
            const updatedBlogs = await blogService.getAll()
            setBlogs(updatedBlogs)
        } catch (error) {
            console.log(error.message)
        }
    }

    if (user) {
        return (
            <div>
                <h2>blogs</h2>
                <p>
                    {user.name} logged in{' '}
                    <button onClick={handleLogout} id="logout-button">
                        Logout
                    </button>
                </p>
                <Notification
                    message={notification}
                    className={notificationType}
                />
                <Togglable buttonLabel={'create new blog'} ref={blogFormRef}>
                    <AddNewBlogForm createBlog={addNewBlog} />
                </Togglable>

                {blogs.map((blog) => (
                    <Blog
                        key={blog.id}
                        blog={blog}
                        userId={user.id}
                        updateBlog={updateBlog}
                        removeBlog={removeBlog}
                    />
                ))}
            </div>
        )
    } else {
        return (
            <>
                <h2>blogs</h2>
                <Notification
                    message={notification}
                    className={notificationType}
                />
                <LoginForm
                    handleLogin={handleLogin}
                    username={username}
                    password={password}
                    setUsername={setUsername}
                    setPassword={setPassword}
                />
            </>
        )
    }
}

export default App
