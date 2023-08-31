import {gql, useQuery} from "@apollo/client";
import Persons from "./components/Persons.jsx";
import PersonForm from "./components/PersonForm.jsx";

const ALL_PERSONS = gql`
query {
  allPersons {
    name
    phone
    id
  }
}
`
function App() {
  const result = useQuery(ALL_PERSONS, {
      pollInterval:2000
  })
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
