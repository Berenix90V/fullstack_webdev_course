const LogoutButton = ({ username, handleLogout }) => {
    return(
        <p>
            { username } logged in{' '}
            <button onClick={handleLogout} id="logout-button">
                Logout
            </button>
        </p>
    )
}

export default LogoutButton