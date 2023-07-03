const Country = ({country}) => {
    return(
        <p>{country.name.common}</p>
    )
}

const SingleCountry = ({country}) => {
    const languages = Object.values(country.languages)
    return(
        <>
            <h2>{country.name.common}</h2>
            <p>capital: {country.capital[0]} </p>
            <p>area: {country.area}</p>
            <h2>Languages</h2>
            {languages.map((lang, index)=><p key={index}>{lang}</p>)}
            <img  src={country.flags.png}/>
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
                <SingleCountry country={countries[0]} />
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