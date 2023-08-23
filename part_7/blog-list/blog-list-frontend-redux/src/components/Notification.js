import { useSelector } from 'react-redux'

const Notification = () => {
    const { message, className } = useSelector((state) => state.notifications)
    if (message !== '') {
        return <div className={ className }> { message } </div>
    }
}

export default Notification
