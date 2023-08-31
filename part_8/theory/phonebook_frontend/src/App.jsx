import {useQuery} from "@apollo/client";
import Persons from "./components/Persons.jsx";
import PersonForm from "./components/PersonForm.jsx";
import {ALL_PERSONS} from "./queries.js";
import {useState} from "react";
import PhoneForm from "./components/PhoneForm.jsx";

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

    if(result.loading){
        return <div>loading...</div>
    }
    const notify = (message) => {
        setErrorMessage(message)
        setTimeout(() => {
            setErrorMessage(null)
        }, 10000)
    }
    return (
        <div>
            <Notify errorMessage={errorMessage}/>
            <Persons persons={result.data.allPersons}></Persons>
            <PersonForm setError={notify} />
            <PhoneForm />
        </div>
    )
}

export default App
