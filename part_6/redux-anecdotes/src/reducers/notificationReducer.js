import {createSlice} from "@reduxjs/toolkit";

const initialState = ''

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotification(state, action){
            return action.payload
        },
        unsetNotification(state, action){
            return ''
        }
    }
})

export const {setNotification, unsetNotification} = notificationSlice.actions

export const setNotificationForACertainTime = (notification, ms) => {
    return dispatch => {
        dispatch(setNotification(notification))
        setTimeout(()=>dispatch(unsetNotification()), ms)
    }
}

export default notificationSlice.reducer