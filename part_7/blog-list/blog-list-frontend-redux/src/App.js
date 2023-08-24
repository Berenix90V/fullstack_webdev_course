import { useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import AddNewBlogForm from './components/AddNewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useDispatch, useSelector } from 'react-redux'
import { setNotificationForAnIntervalOfTime } from './reducers/notificationReducer'
import { addNewBlog, initializeBlogs, removeBlog, updateBlog } from './reducers/blogReducer'
import { setUser, userLogout } from './reducers/loginReducer'

const App = () => {
    const blogs = useSelector(state => state.blogs)
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()

    const blogFormRef = useRef()

    useEffect(() => {
        dispatch(initializeBlogs())
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            dispatch(setUser(user))
            blogService.setToken(user.token)
        }
    }, [])

    const handleLogout = () => {
        try {
            dispatch(userLogout())
        } catch (error) {
            console.log('Logout Error: ', error.message)
        }
    }
    const handleBlogCreation = async (blogObject) => {
        blogFormRef.current.toggleVisibility()
        try{
            dispatch(addNewBlog(blogObject))
            dispatch(setNotificationForAnIntervalOfTime({
                message: `A new blog is created: ${blogObject.title} by ${blogObject.author}`,
                type: 'success',
            }, 5000))
        } catch(error){
            console.log(error.message)
        }
    }

    const handleUpdateBlog = async (blogObject) => {
        try {
            dispatch(updateBlog(blogObject))
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleRemoveBlog = async (blogId) => {
        try {
            dispatch(removeBlog(blogId))
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
                <Notification/>
                <Togglable buttonLabel={'create new blog'} ref={blogFormRef}>
                    <AddNewBlogForm createBlog={handleBlogCreation} />
                </Togglable>

                {blogs.map((blog) => (
                    <Blog
                        key={blog.id}
                        blog={blog}
                        userId={user.id}
                        updateBlog={handleUpdateBlog}
                        removeBlog={handleRemoveBlog}
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
