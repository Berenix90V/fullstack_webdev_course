import { useState } from 'react'

const AddNewCommentForm = ({ addNewComment }) => {
    const [comment, setComment] = useState('')
    const handleCommentChange = (event) => {
        const newValue = event.target.value
        setComment(newValue)
    }

    const handleNewComment = (event) => {
        event.preventDefault()
        addNewComment(comment)
        setComment('')
    }

    return(
        <form onSubmit={handleNewComment}>
            <input name="comment" value={comment} onChange={handleCommentChange}/>
            <button type="submit">add comment</button>
        </form>
    )
}

export default AddNewCommentForm