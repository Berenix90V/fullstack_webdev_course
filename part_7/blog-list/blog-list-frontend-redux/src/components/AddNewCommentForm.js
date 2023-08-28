import { useState } from 'react'

const AddNewCommentForm = () => {
    const [comment, setComment] = useState('')
    const handleCommentChange = (event) => {
        const newValue = event.target.value
        setComment(newValue)
    }

    const handleNewComment = (event) => {
        event.preventDefault()
        console.log(comment)
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