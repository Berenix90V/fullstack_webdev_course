import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'

const initialState = null

const loginSLice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        setUser(state, action){
            return action.payload
        },
        unsetUser(){
            return null
        }
    }
})

export const { setUser, unsetUser } = loginSLice.actions
export const userLogin = (username, password) => {
    return async dispatch => {
        const user = await loginService.login({ username, password })
        dispatch(setUser(user))
        blogService.setToken(user.token)
        window.localStorage.setItem('loggedUser', JSON.stringify(user))
    }
}

export const userLogout = () => {
    return async dispatch => {
        window.localStorage.removeItem('loggedUser')
        dispatch(setUser(null))
        blogService.setToken(null)
    }
}
export default loginSLice.reducer