import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
const User = ({ user }) => {
    const blogs = user.blogs.length
    return (
        <tr>
            <td><Link to={`/users/${user.id}`} >{user.name}</Link></td>
            <td>{blogs}</td>
        </tr>
    )
}

const Users = ({ users }) => {

    return(
        <>
            <h2>Users</h2>
            <Table striped>
                <thead>
                    <tr>
                        <th></th>
                        <th>blogs created</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => <User key={user.id} user={user} />)}
                </tbody>

            </Table>

        </>
    )
}

export default Users