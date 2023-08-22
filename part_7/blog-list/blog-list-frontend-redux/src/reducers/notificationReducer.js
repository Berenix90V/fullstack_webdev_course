import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    message: '',
    type: ''
}

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setNotification(state, action){
            return action.payload
        },
        unsetNotification(state, action){
            return {
                message: '',
                type: ''
            }
        }
    }
})

export default notificationSlice.reducer