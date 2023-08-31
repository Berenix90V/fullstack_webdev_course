import {useQuery} from "@apollo/client";
import Persons from "./components/Persons.jsx";
import PersonForm from "./components/PersonForm.jsx";
import {ALL_PERSONS} from "./queries.js";

function App() {
  const result = useQuery(ALL_PERSONS)
  if(result.loading){
    return <div>loading...</div>
  }
  return (
    <div>
      <Persons persons={result.data.allPersons}></Persons>
      <PersonForm/>
    </div>
  )
}

export default App
