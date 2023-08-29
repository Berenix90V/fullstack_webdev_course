import { useSelector } from 'react-redux'
import { Alert } from 'react-bootstrap'

const Notification = () => {
    const { message, className } = useSelector((state) => state.notifications)
    if (message !== '') {
        return (
            <Alert variant={className}>
                {message}
            </Alert>
        )
    }
}

export default Notification
