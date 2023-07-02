import {useState} from "react";
import Form from "./components/Form";
import Filter from "./components/Filter";
import Persons from "./components/Persons";

const App = () => {
    const [persons, setPersons] = useState([{name:'Arto Hellas', number: '040-1234567'}])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
    const personsToShow = filter ===''? persons : persons.filter(
        (person)=>person.name.toLowerCase().includes(filter.toLowerCase())
    )

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }
    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }
    const handleFilterChange = (event) => {
        setFilter(event.target.value)
    }
    const addPerson = (event) => {
        event.preventDefault()
        if(persons.find(element => element.name === newName)){
            const message = `${newName} is already added to phonebook`
            alert(message)
        }
        else{
            const personObject = {
                name: newName,
                number: newNumber
            }
            setPersons(persons.concat(personObject))
        }

    }
    return (
    <div className="App">
        <h2>Phonebook</h2>
        <Filter filter={{changeHandler: handleFilterChange, value: filter}} />
        <h3>Add new</h3>
        <Form name={{changeHandler: handleNameChange, value: newName}}
              number={{changeHandler: handleNumberChange, value: newNumber}}
              addPerson={addPerson}
        />
        <h3>Numbers</h3>
        <Persons persons={personsToShow} />
    </div>
    );
}

export default App;
