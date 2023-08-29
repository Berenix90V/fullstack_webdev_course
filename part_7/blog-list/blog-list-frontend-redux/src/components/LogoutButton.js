import { Button, Container } from 'react-bootstrap'

const LogoutButton = ({ username, handleLogout }) => {
    return(
        <Container >
            { username } logged in{' '}
            <Button onClick={handleLogout} id="logout-button" variant="primary">
                Logout
            </Button>
        </Container>
    )
}

export default LogoutButton