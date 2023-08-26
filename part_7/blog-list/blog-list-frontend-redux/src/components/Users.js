import { useEffect, useState } from 'react'
import userService from '../services/users'

const User = ({ user }) => {
    const blogs = user.blogs.length
    return (
        <tr>
            <td>{user.name}</td>
            <td>{blogs}</td>
        </tr>
    )
}

const Users = () => {
    const [users, setUsers] = useState([])
    useEffect(() => {
        const initializeUsers = async () => {
            const allUsers =  await userService.getAll()
            setUsers(allUsers)
        }
        initializeUsers()
    },[])

    return(
        <>
            <h2>Users</h2>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>blogs created</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => <User key={user.id} user={user} />)}
                </tbody>

            </table>

        </>
    )
}

export default Users