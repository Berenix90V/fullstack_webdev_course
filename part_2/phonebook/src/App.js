import {useState} from "react";

const App = () => {
    const [persons, setPersons] = useState([{name:'Arto Hellas', number: '040-1234567'}])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }
    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
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
        <form onSubmit={addPerson}>
            <div>
                name: <input onChange={handleNameChange} value={newName}/>
            </div>
            <div>
                number: <input onChange={handleNumberChange} value={newNumber}/>
            </div>
            <div>
              <button type="submit">add</button>
            </div>
        </form>
        <h2>Numbers</h2>
        <div>
            {persons.map((person)=><p key={person.name}>{person.name}: {person.number}</p>)}
        </div>
    </div>
    );
}

export default App;
