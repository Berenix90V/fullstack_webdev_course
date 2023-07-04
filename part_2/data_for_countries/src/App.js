import countriesServices from './services/countries'
import {useEffect, useState} from "react";
import Countries from './components/Countries'


const App = () => {
    const [filter, setFilter] = useState('')
    const [countries, setCountries] = useState([])
    let filteredCountries = filter===''? [] : countries.filter(c=>c.name.common.toLowerCase().includes(filter.toLowerCase()))

    useEffect(()=>{
        countriesServices
            .getAll()
            .then(allCountries=>{
                setCountries(allCountries)
            })
    }, [])
    const handleOnFilterChange = (event)=>{
        setFilter(event.target.value)
    }

    return (
        <>
            <h1>Countries</h1>
            <p>Find countries: <input onChange={handleOnFilterChange}/></p>
            <Countries countries={filteredCountries} filter={filter} />
        </>
    );
}

export default App;
