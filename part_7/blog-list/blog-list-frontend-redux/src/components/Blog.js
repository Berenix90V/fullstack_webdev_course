import { removeBlog, updateBlog } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

const Blog = ({ blog, userId }) => {
    const dispatch = useDispatch()

    if(!blog){
        return (
            <div>loading data</div>
        )
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
        <div >
            <h2>{blog.title} by {blog.author}</h2>
            <div>
                <Link to={blog.url}>url: {blog.url}</Link>
                <p id="likes">
                    likes: {blog.likes}{' '}
                    <button onClick={handleAddLike} id="add-like">
                        like
                    </button>{' '}
                </p>
                <p id="user">added by {blog.user.name}</p>
            </div>
            {blog.user.id === userId && (
                <button onClick={handleRemoveBlog}>delete</button>
            )}
        </div>
    )
}

export default Blog
