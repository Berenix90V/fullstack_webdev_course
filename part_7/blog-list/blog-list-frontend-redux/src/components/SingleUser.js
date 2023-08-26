const Blog = ({ blog }) => {
    return(
        <li>
            {blog.title}
        </li>
    )
}

const SingleUser = ({ user }) => {
    if(!user){
        return(
            <div>loading data</div>
        )
    }
    return(
        <>
            <h2>{user.name}</h2>
            <h3>added blogs</h3>
            <ul>
                {user.blogs.map(blog => <Blog key={blog.id} blog={blog}/>)}
            </ul>
        </>
    )
}

export default SingleUser