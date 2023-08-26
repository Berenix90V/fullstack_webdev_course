import { useRef, useContext } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import AddNewBlogForm from './components/AddNewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import LoginContext from './contexts/LoginContext'
import { useNotificationDispatch } from './contexts/NotificationContext'

const App = () => {
    const queryClient = useQueryClient()
    const notificationDispatch = useNotificationDispatch()
    const [user, userDispatch] = useContext(LoginContext)
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

    const deleteBlogMutation = useMutation(blogService.remove, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
        },
        onError: error => console.log(error.message)
    })

    if(result.isLoading){
        return <div>loading data...</div>
    }
    const blogs = result.data
    blogs.sort((a, b) => b.likes - a.likes)

    const addNewBlog = async (blogObject) => {
        blogFormRef.current.toggleVisibility()
        newBlogMutation.mutate(blogObject)
    }

    const updateBlog = async (blogObject) => {
        updateBlogMutation.mutate(blogObject)
    }

    const removeBlog = async (blogId) => {
        deleteBlogMutation.mutate(blogId)
    }

    const handleLogout = () => {
        userDispatch({ type: 'unsetUser' })
        try {
            window.localStorage.removeItem('loggedUser')
            blogService.setToken(null)
        } catch (error) {
            console.log('Logout Error: ', error.message)
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
                <LoginForm />
            </>
        )
    }
}

export default App
