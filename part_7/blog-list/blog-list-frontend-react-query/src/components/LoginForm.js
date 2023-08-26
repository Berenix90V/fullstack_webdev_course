import { useEffect, useState } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { useMutation } from '@tanstack/react-query'
import { useLoginDispatch } from '../contexts/LoginContext'
import { useNotificationDispatch } from '../contexts/NotificationContext'

const LoginForm = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const userDispatch = useLoginDispatch()
    const notificationDispatch = useNotificationDispatch()
    const userLoginMutation = useMutation(loginService.login, {
        onSuccess: (user) => {
            userDispatch({
                type: 'setUser',
                payload: user
            })
            blogService.setToken(user.token)
            window.localStorage.setItem('loggedUser', JSON.stringify(user))
        },
        onError: () => {
            notificationDispatch({
                type: 'setNotification',
                payload: {
                    message: 'Invalid user or password',
                    type: 'error'
                }
            })
            setTimeout(() => {
                notificationDispatch({ type: 'unsetNotification' })
            }, 5000)
        }
    } )

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            userDispatch({
                type: 'setUser',
                payload: user
            })
            blogService.setToken(user.token)
        }
    }, [userDispatch])



    const handleLogin = async (event) => {
        event.preventDefault()
        userLoginMutation.mutate({ username, password })
        setUsername('')
        setPassword('')
    }

    return (
        <>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input
                        type="text"
                        value={username}
                        name="Username"
                        id="username"
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                    <input
                        type="password"
                        value={password}
                        name="Password"
                        id="password"
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit" id="login-button">
                    Login
                </button>
            </form>
        </>
    )
}


export default LoginForm
