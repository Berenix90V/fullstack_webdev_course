import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import AddNewBlogForm from './components/AddNewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useDispatch, useSelector } from 'react-redux'
import {
    setNotification,
    unsetNotification,
} from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'

const App = () => {
    const blogs = useSelector(state => state.blogs)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const dispatch = useDispatch()

    const blogFormRef = useRef()

    useEffect(() => {
        dispatch(initializeBlogs())
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
            // setNotification('Invalid user or password')
            // setNotificationType('error')
            dispatch(
                setNotification({
                    message: 'Invalid user or password',
                    type: 'error',
                }),
            )

            setTimeout(() => {
                dispatch(unsetNotification())
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
            //const updatedBlogs = await blogService.getAll()
            // setBlogs(updatedBlogs)
            dispatch(
                setNotification({
                    message: `A new blog is created: ${createdBlog.title} by ${createdBlog.author}`,
                    type: 'success',
                }),
            )
            setTimeout(() => {
                dispatch(unsetNotification())
            }, 5000)
        }
    }

    const updateBlog = async (blogObject) => {
        console.log(blogObject)
        // try {
        //     await blogService.update(blogObject)
        //     const updatedBlogs = await blogService.getAll()
        //     updatedBlogs.sort((a, b) => b.likes - a.likes)
        //     setBlogs(updatedBlogs)
        // } catch (error) {
        //     console.log(error.message)
        // }
    }

    const removeBlog = async (blogId) => {
        console.log(blogId)
        // try {
        //     await blogService.remove(blogId)
        //     const updatedBlogs = await blogService.getAll()
        //     setBlogs(updatedBlogs)
        // } catch (error) {
        //     console.log(error.message)
        // }
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
                <Notification/>
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
                <Notification />
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
