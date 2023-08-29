import { ListGroup } from 'react-bootstrap'

const Blog = ({ blog }) => {
    return(
        <ListGroup.Item>
            {blog.title}
        </ListGroup.Item>
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
            <ListGroup>
                {user.blogs.map(blog => <Blog key={blog.id} blog={blog}/>)}
            </ListGroup>
        </>
    )
}

export default SingleUser