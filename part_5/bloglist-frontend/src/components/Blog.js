import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, userId, updateBlog, removeBlog }) => {
    const [visibleDetails, setVisibleDetails] = useState(false)
    const hideWhenVisible = { display: visibleDetails? 'none':'' }
    const showWhenVisible = { display: visibleDetails? '':'none' }
    const toggleVisibility = () => {
        setVisibleDetails(!visibleDetails)
    }

    const updateLikes = async () => {
        blog.likes +=1
        await updateBlog(blog)
    }
    const deleteBlog = async() => {
        const blogId = blog.id
        if(window.confirm(`Remove ${blog.title} by ${blog.author}?`)){
            await removeBlog(blogId)
        }
    }
    return(
        <div className="blog">
            {blog.title} {blog.author}
            <button style={hideWhenVisible} onClick={toggleVisibility}>view</button>
            <button style={showWhenVisible} onClick={toggleVisibility}>hide</button>
            <div style={showWhenVisible}>
                <p>url: {blog.url}</p>
                <p>likes: {blog.likes} <button onClick={updateLikes}>like</button> </p>
                <p>{blog.user.name}</p>
            </div>
            {blog.user.id === userId && <button onClick={deleteBlog}>delete</button>}
        </div>
    )
}

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
    updateBlog: PropTypes.func.isRequired,
    removeBlog: PropTypes.func.isRequired
}

export default Blog