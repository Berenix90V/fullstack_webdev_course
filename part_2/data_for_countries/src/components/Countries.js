import {useState} from "react";
import Weather from "./Weather";


const Country = ({country}) => {
    const [show, setShow] = useState(false)
    if(show)
        return(
            <>
                <p>{country.name.common} <button onClick={()=>setShow(!show)}>hide</button></p>
                <CountryDetails country={country} />
            </>
            
        )
    else
        return(
            <p>{country.name.common} <button onClick={()=>setShow(!show)}>show</button></p>
        )
}

const CountryDetails = ({country}) => {
    const languages = Object.values(country.languages)
    return(
        <>
            <h2>{country.name.common}</h2>
            <p>capital: {country.capital[0]} </p>
            <p>area: {country.area}</p>
            <h2>Languages</h2>
            {languages.map((lang, index)=><p key={index}>{lang}</p>)}
            <img  alt="Country's flag" src={country.flags.png}/>
            <Weather country={country} />
        </>
    )
}
const Countries = ({countries, filter}) => {
    if(filter !== '' && countries.length>10){
        return(
            <p>Too many matches, specify another filter</p>
        )

    }
    else{
        if(countries.length===1){
            return(
                <CountryDetails country={countries[0]} />
            )
        } else {
            return (
                <div>
                    {countries.map((country, index) => <Country key={index} country={country}/>)}
                </div>
            )
        }
    }

}
export default Countries