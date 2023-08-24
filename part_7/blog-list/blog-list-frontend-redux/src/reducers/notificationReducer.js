import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    message: '',
    type: '',
}

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setNotification(state, action) {
            return action.payload
        },
        unsetNotification() {
            return {
                message: '',
                type: '',
            }
        },
    },
})

export const { setNotification, unsetNotification } = notificationSlice.actions

export const setNotificationForAnIntervalOfTime = (notification, ms) => {
    return dispatch => {
        dispatch(
            setNotification(notification),
        )
        setTimeout(() => {
            dispatch(unsetNotification())
        }, ms)
    }
}
export default notificationSlice.reducer
