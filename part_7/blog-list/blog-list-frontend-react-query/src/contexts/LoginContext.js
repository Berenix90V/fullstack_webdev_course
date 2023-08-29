import { createContext, useContext, useEffect, useReducer } from 'react'
import blogService from '../services/blogs'

const loginReducer = (state,action) => {
    switch(action.type){
        case 'setUser':
            return action.payload
        case 'unserUser':
            return null
    }
}

const LoginContext = createContext()

export const LoginContextProvider = (props) => {
    const [user, userDispatch] = useReducer(loginReducer, null)
    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            userDispatch({ type: 'setUser', payload: user })
            blogService.setToken(user.token)
        }
    }, [])
    return(
        <LoginContext.Provider value={[user, userDispatch]}>
            {props.children}
        </LoginContext.Provider>
    )
}

export const useLoginDispatch = () => {
    const userAndDispatch = useContext(LoginContext)
    return userAndDispatch[1]
}
export default LoginContext