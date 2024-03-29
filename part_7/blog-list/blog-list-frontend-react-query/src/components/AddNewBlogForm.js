import { useState } from 'react'
import PropTypes from 'prop-types'

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
            <form onSubmit={handleAddNewBlog}>
                <p>
                    title{' '}
                    <input
                        id="title-input"
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </p>
                <p>
                    author{' '}
                    <input
                        id="author-input"
                        value={author}
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </p>
                <p>
                    url{' '}
                    <input
                        id="url-input"
                        value={url}
                        onChange={({ target }) => setUrl(target.value)}
                    />
                </p>
                <button type="submit" id="create-blog">
                    create
                </button>
            </form>
        </>
    )
}

AddNewBlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired,
}

export default AddNewBlogForm
