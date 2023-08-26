import { useEffect, useRef, useState } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import AddNewBlogForm from './components/AddNewBlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useDispatch, useSelector } from 'react-redux'
import { setNotificationForAnIntervalOfTime } from './reducers/notificationReducer'
import { addNewBlog, initializeBlogs } from './reducers/blogReducer'
import { setUser, userLogout } from './reducers/loginReducer'
import LogoutButton from './components/LogoutButton'
import { Link, Route, Routes, useMatch } from 'react-router-dom'
import Users from './components/Users'
import userService from './services/users'
import SingleUser from './components/SingleUser'

const Home = ({ blogs }) => {
    const blogFormRef = useRef()
    const dispatch = useDispatch()

    if(!blogs){
        return (
            <div>loading data</div>
        )
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

    return (
        <>
            <Togglable buttonLabel={'create new blog'} ref={blogFormRef}>
                <AddNewBlogForm createBlog={handleBlogCreation} />
            </Togglable>
            {blogs.map((blog) => {
                return (
                    <div key={blog.id} className="blog">
                        <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
                    </div>
                )
            })}
        </>
    )
}

const App = () => {
    const user = useSelector(state => state.user)
    const [users, setUsers] = useState([])
    const blogs = useSelector(state => state.blogs)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializeBlogs())
    }, [])


    useEffect(() => {
        const initializeUsers = async () => {
            const allUsers =  await userService.getAll()
            setUsers(allUsers)
        }
        initializeUsers()
    },[])

    const userMatch = useMatch('/users/:id')
    const visualizedUser = userMatch? users.find(u => u.id===userMatch.params.id) : null

    const blogMatch = useMatch('/blogs/:id')
    const visualizedBlog = blogMatch? blogs.find(b => b.id===blogMatch.params.id) : null


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

    const padding = {
        padding: 5
    }

    if (user) {
        return (
            <div>

                <div className="navbar">
                    <Link style={padding} to="/">blogs</Link>
                    <Link style={padding} to="/users">users</Link>
                    <LogoutButton username={user.name} handleLogout={handleLogout} />
                </div>
                <h2>blogs</h2>
                <Notification/>
                <Routes>
                    <Route path="/" element={<Home blogs={blogs} />} />
                    <Route path="/users" element={<Users users={users} />}/>
                    <Route path="/users/:id" element={<SingleUser user={visualizedUser} />} />
                    <Route path="/blogs/:id" element={<Blog blog={visualizedBlog} userId={user.id} />}/>
                </Routes>
            </div>
        )
    } else {
        return (
            <div>
                <h2>blogs</h2>
                <LoginForm />
            </div>
        )
    }
}

export default App
