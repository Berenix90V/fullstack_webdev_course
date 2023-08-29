import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

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
        <Form onSubmit={handleNewComment}>
            <Form.Control name="comment" value={comment} onChange={handleCommentChange}/>
            <Button type="submit" variant="primary">add comment</Button>
        </Form>
    )
}

export default AddNewCommentForm