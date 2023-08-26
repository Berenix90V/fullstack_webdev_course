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
import { Route, Routes, useMatch } from 'react-router-dom'
import Users from './components/Users'
import userService from './services/users'
import SingleUser from './components/SingleUser'

const Home = ({ user }) => {
    const blogFormRef = useRef()
    const blogs = useSelector(state => state.blogs)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializeBlogs())
    }, [])

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

            {blogs.map((blog) => (
                <Blog
                    key={blog.id}
                    blog={blog}
                    userId={user.id}
                />
            ))}
        </>
    )
}

const App = () => {
    const user = useSelector(state => state.user)
    const [users, setUsers] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        const initializeUsers = async () => {
            const allUsers =  await userService.getAll()
            setUsers(allUsers)
        }
        initializeUsers()
    },[])

    const match = useMatch('/users/:id')
    const visualizedUser = match? users.find(u => u.id===match.params.id) : null


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


    if (user) {
        return (
            <div>
                <h2>blogs</h2>
                <LogoutButton username={user.name} handleLogout={handleLogout} />
                <Notification/>

                <Routes>
                    <Route path="/" element={<Home user={user} />} />
                    <Route path="/users" element={<Users users={users} />}/>
                    <Route path="/users/:id" element={<SingleUser user={visualizedUser} />} />
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
