const LoginForm = ({user, handleLogin, username, setUsername, password, setPassword}) => {
    if (!user) {
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
                <button type="subit" >login</button>
            </form>
        )
    }

}

export default LoginForm