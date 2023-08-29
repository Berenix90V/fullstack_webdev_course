import { useState } from 'react'
import { userLogin } from '../reducers/loginReducer'
import { setNotificationForAnIntervalOfTime } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import { Button, Form } from 'react-bootstrap'

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
        <div className="container">
            <h2>Login</h2>
            <Form onSubmit={handleLogin}>
                <Form.Group>
                    <Form.Label>username: </Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        name="Username"
                        id="username"
                        onChange={({ target }) => setUsername(target.value)}
                    />
                    <Form.Label>password: </Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        name="Password"
                        id="password"
                        onChange={({ target }) => setPassword(target.value)}
                    />
                    <Button variant="primary" type="submit" id="login-button">
                        Login
                    </Button>
                </Form.Group>
            </Form>
        </div>
    )
}

export default LoginForm
