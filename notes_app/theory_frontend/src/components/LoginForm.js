import {useState} from "react";
import Notification from "./Notification";
import PropTypes from "prop-types";

const LoginForm = ({login, setUser}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] =  useState(null)

    const handleLogin = async (event) => {
        event.preventDefault()
        try{
            const user = await login(username, password)
            setUsername('')
            setPassword('')
            setUser(user)
        } catch (exception) {
            setErrorMessage('Wrong credentials')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    return (
        <form onSubmit={handleLogin}>
            <div>
                username
                <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({target}) => setUsername(target.value)}
                />
            </div>
            <div>
                password
                <input
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({target}) => setPassword(target.value)}
                />
            </div>
            <button type="submit" >login</button>
            <Notification message={errorMessage} className='error' />
        </form>
    )
}

LoginForm.propTypes = {
    login: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired
}

export default LoginForm