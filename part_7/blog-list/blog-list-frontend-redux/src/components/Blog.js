import { useState } from 'react'
import { removeBlog, updateBlog } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'

const Blog = ({ blog, userId }) => {
    const [visibleDetails, setVisibleDetails] = useState(false)
    const hideWhenVisible = { display: visibleDetails ? 'none' : '' }
    const showWhenVisible = { display: visibleDetails ? '' : 'none' }
    const dispatch = useDispatch()

    if(!blog){
        return (
            <div>loading data</div>
        )
    }
    const toggleVisibility = () => {
        setVisibleDetails(!visibleDetails)
    }

    const handleAddLike = async () => {
        const updatedBlog = { ...blog, likes: blog.likes+1 }
        try {
            dispatch(updateBlog(updatedBlog))
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleRemoveBlog = async () => {
        const blogId = blog.id
        if (window.confirm(`Remove ${blog.title} by ${blog.author}?`)){
            try {
                dispatch(removeBlog(blogId))
            } catch (error) {
                console.log(error.message)
            }
        }
    }

    return (
        <div className="blog">
            {blog.title} by {blog.author}
            <button
                style={hideWhenVisible}
                onClick={toggleVisibility}
                id="expand-button"
            >
                view
            </button>
            <button
                style={showWhenVisible}
                onClick={toggleVisibility}
                id="hide-button"
            >
                hide
            </button>
            <div style={showWhenVisible} className="additional-info">
                <p id="url">url: {blog.url}</p>
                <p id="likes">
                    likes: {blog.likes}{' '}
                    <button onClick={handleAddLike} id="add-like">
                        like
                    </button>{' '}
                </p>
                <p id="user">{blog.user.name}</p>
            </div>
            {blog.user.id === userId && (
                <button onClick={handleRemoveBlog}>delete</button>
            )}
        </div>
    )
}

export default Blog
