import {useState} from "react";

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
        <h1>Phonebook</h1>
        <div>
            filter shown with <input onChange={handleFilterChange} value={filter}/>
        </div>
        <h2>Add new</h2>
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
            {personsToShow.map((person)=><p key={person.name}>{person.name}: {person.number}</p>)}
        </div>
    </div>
    );
}

export default App;
