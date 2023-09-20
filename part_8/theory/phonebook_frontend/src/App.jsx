import {useApolloClient, useQuery, useSubscription} from "@apollo/client";
import Persons from "./components/Persons.jsx";
import PersonForm from "./components/PersonForm.jsx";
import {ALL_PERSONS, PERSON_ADDED} from "./queries.js";
import {useState} from "react";
import PhoneForm from "./components/PhoneForm.jsx";
import LoginForm from "./components/LoginForm.jsx";
import {updateCache} from "./utils.js";

const Notify = ({errorMessage}) => {
    if(!errorMessage){
        return null
    }
    return (
        <div style={{color: 'red'}}>
            {errorMessage}
        </div>
    )
}

function App() {
    const [errorMessage, setErrorMessage] = useState(null)
    const result = useQuery(ALL_PERSONS)
    const [token, setToken] = useState(null)
    const client = useApolloClient()

    const notify = (message) => {
        setErrorMessage(message)
        setTimeout(() => {
            setErrorMessage(null)
        }, 10000)
    }

    useSubscription(PERSON_ADDED, {
        onData: ({data, client}) => {
            const addedPerson = data.data.personAdded
            notify(`${addedPerson} added`)

            updateCache( client.cache, ALL_PERSONS, addedPerson )
            // client.cache.updateQuery({ query: ALL_PERSONS}, ({allPersons}) => {
            //     return {
            //         allPersons: allPersons.concat(addedPerson)
            //     }
            // })
        }
    })

    if(result.loading){
        return <div>loading...</div>
    }

    const logout = () => {
        setToken(null)
        localStorage.clear()
        client.resetStore()
    }

    if(!token){
        return (
            <div>
                <Notify errorMessage={errorMessage} />
                <h2>Login</h2>
                <LoginForm
                    setToken={setToken}
                    setError={notify}
                />
            </div>
        )
    }

    return (
        <div>
            <Notify errorMessage={errorMessage}/>
            <button onClick={logout}>logout</button>
            <Persons persons={result.data.allPersons}></Persons>
            <PersonForm setError={notify} />
            <PhoneForm setError={notify} />
        </div>
    )
}

export default App
