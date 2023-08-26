import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import AddNewBlogForm from './components/AddNewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useNotificationDispatch } from './contexts/NotificationContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const App = () => {
    const queryClient = useQueryClient()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const notificationDispatch = useNotificationDispatch()

    const blogFormRef = useRef()

    const result = useQuery({
        queryKey: ['blogs'],
        queryFn: blogService.getAll
    })

    const newBlogMutation = useMutation(blogService.create, {
        onSuccess: (newBlog) => {
            const blogs = queryClient.getQueryData(['blogs'])
            const updatedBlogs = blogs.concat(newBlog)
            updatedBlogs.sort((a, b) => b.likes - a.likes)
            queryClient.setQueryData(['blogs'], updatedBlogs)
            notificationDispatch({
                type: 'setNotification',
                payload: {
                    message: `A new blog is created: ${newBlog.title} by ${newBlog.author}`,
                    type: 'success'
                }
            })

            setTimeout(() => {
                notificationDispatch({ type: 'unsetNotification' })
            }, 5000)
        },
        onError: (error) => {
            notificationDispatch({
                type: 'setNotification',
                payload: {
                    message: error.message,
                    type: 'error'
                }
            })

            setTimeout(() => {
                notificationDispatch({ type: 'unsetNotification' })
            }, 5000)
        }
    })

    const updateBlogMutation = useMutation(blogService.update, {
        onSuccess: (updatedBlog => {
            const blogs = queryClient.getQueryData(['blogs'])
            const id = updatedBlog.id
            const updatedBlogs = blogs.map(blog => blog.id===id? updatedBlog : blog )
            updatedBlogs.sort((a,b) => b.likes-a.likes)
            queryClient.setQueryData(['blogs'], updatedBlogs)
        }),
        onError: error => {
            console.log(error.message)
        }
    })

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    // end of hooks

    if(result.isLoading){
        return <div>loading data...</div>
    }
    const blogs = result.data
    blogs.sort((a, b) => b.likes - a.likes)

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
            notificationDispatch({
                type: 'setNotification',
                payload: {
                    message: 'Invalid user or password',
                    type: 'error'
                }
            })
            setTimeout(() => {
                notificationDispatch({ type: 'unsetNotification' })
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
        newBlogMutation.mutate(blogObject)
    }

    const updateBlog = async (blogObject) => {
        updateBlogMutation.mutate(blogObject)
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
