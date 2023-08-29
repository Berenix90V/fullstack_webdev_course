import  { useNotificationValue } from '../contexts/NotificationContext'

const Notification = () => {
    const notification = useNotificationValue()
    const { message, type } = { ...notification }
    if (message !== '') {
        return <div className={type}> {message} </div>
    }
}

export default Notification
