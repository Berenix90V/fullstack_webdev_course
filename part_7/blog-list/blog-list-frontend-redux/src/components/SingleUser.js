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
            <h3>{user.name}</h3>
            <h4>added blogs</h4>
            <ListGroup>
                {user.blogs.map(blog => <Blog key={blog.id} blog={blog}/>)}
            </ListGroup>
        </>
    )
}

export default SingleUser