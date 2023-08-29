import { addCommentToBlog, removeBlog, updateBlog } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import AddNewCommentForm from './AddNewCommentForm'
import { Button } from 'react-bootstrap'

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

    const addNewComment = async (content) => {
        const newComment = {
            content: content,
            blog: blog.id
        }
        dispatch(addCommentToBlog(newComment))
        const newComments = blog.comments.concat(newComment)
        dispatch(updateBlog({ ...blog, comments: newComments }))

    }

    return (
        <div>
            <h2>{blog.title} by {blog.author}</h2>
            <div>
                <Link to={blog.url}>url: {blog.url}</Link>
                <p id="likes">
                    likes: {blog.likes}
                    <Button onClick={ handleAddLike } id="add-like" variant="primary">
                        like
                    </Button>
                </p>
                <p id="user">added by {blog.user.name}</p>
            </div>
            {blog.user.id === userId && (
                <Button onClick={handleRemoveBlog} variant="danger">delete</Button>
            )}
            <h3>comments</h3>
            <AddNewCommentForm addNewComment={addNewComment}/>
            <ul>
                {blog.comments.map(comment => <li key={comment.id}>{comment.content}</li>)}
            </ul>

        </div>
    )
}

export default Blog
