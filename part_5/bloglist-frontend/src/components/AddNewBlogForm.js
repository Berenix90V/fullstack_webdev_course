const AddNewBlogForm = ({handleAddNewBlog, title, setTitle, author, setAuthor, url, setUrl}) => {
    return(
        <form onSubmit={handleAddNewBlog}>
            <p>title <input value={title} onChange={({target}) => setTitle(target.value)}/></p>
            <p>author <input value={author} onChange={({target}) => setAuthor(target.value)}/></p>
            <p>url <input value={url} onChange={({target}) => setUrl(target.value)}/></p>
            <button type="submit">submit</button>
        </form>
    )
}

export default AddNewBlogForm