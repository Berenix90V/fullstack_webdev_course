import { useState } from 'react'
import { userLogin } from '../reducers/loginReducer'
import { setNotificationForAnIntervalOfTime } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'

const LoginForm = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()

    const handleLogin = async event => {
        event.preventDefault()
        try {
            await dispatch(userLogin(username, password))
            setUsername('')
            setPassword('')
        } catch(error){
            dispatch(setNotificationForAnIntervalOfTime({
                message: 'Invalid user or password',
                type: 'error',
            }, 5000))
            console.log('Login Error: ', error.message)
        }
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
