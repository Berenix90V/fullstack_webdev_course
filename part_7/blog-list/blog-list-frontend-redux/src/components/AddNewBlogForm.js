import { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form } from 'react-bootstrap'

const AddNewBlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleAddNewBlog = async (event) => {
        event.preventDefault()
        const blogObject = { title, author, url }
        try {
            await createBlog(blogObject)
        } catch (error) {
            console.log(error.message)
        }
        setTitle('')
        setAuthor('')
        setUrl('')
    }
    return (
        <>
            <h3>Create Blog</h3>
            <Form onSubmit={handleAddNewBlog}>
                <Form.Group>
                    <Form.Label>title</Form.Label>
                    <Form.Control
                        id="title-input"
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                    />
                    <Form.Label>author</Form.Label>
                    <Form.Control
                        id="author-input"
                        value={author}
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                    <Form.Label>url</Form.Label>
                    <Form.Control
                        id="url-input"
                        value={url}
                        onChange={({ target }) => setUrl(target.value)}
                    />
                    <Button type="submit" id="create-blog">
                        create
                    </Button>
                </Form.Group>

            </Form>
        </>
    )
}

AddNewBlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired,
}

export default AddNewBlogForm
