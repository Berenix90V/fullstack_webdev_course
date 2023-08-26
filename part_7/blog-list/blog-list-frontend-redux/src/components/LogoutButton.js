const LogoutButton = ({ username, handleLogout }) => {
    return(
        <>
            { username } logged in{' '}
            <button onClick={handleLogout} id="logout-button">
                Logout
            </button>
        </>
    )
}

export default LogoutButton