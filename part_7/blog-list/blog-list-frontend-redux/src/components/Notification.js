import PropTypes from 'prop-types'
import {useSelector} from 'react-redux'

const Notification = () => {
    const {message, className} = useSelector(state=>state.notifications)
    if (message !== '') {
        return <div className={className}> {message} </div>
    }
}

Notification.propTypes = {
    message: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
}

export default Notification
