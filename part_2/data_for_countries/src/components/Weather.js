import {useEffect, useState} from "react";
import weatherServices from "../services/weather"

const Weather = ({country}) => {
    const [weatherObj, setWeatherObj] = useState(null)
    const capital = country.capital[0]
    const countryAbbreviation = country.altSpellings[0]
    useEffect(()=>{
        weatherServices
            .getWeather(capital, countryAbbreviation.toLowerCase())
            .then(response => setWeatherObj(response))
    }, [capital, countryAbbreviation])
    if(weatherObj){
        const weatherIcon = weatherObj.weather[0].icon
        const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
        return(
            <>
                <h2>Weather in  {capital}</h2>
                <p>temperature {(weatherObj.main.temp-273.15).toFixed(2)} Celsius</p>
                <img alt={weatherObj.weather[0].description} src={iconUrl} />
                <p>wind {weatherObj.wind.speed} m/s</p>
            </>
        )
    }

    else
        return (
            <p>Weather not accessible</p>
        )
}
export default Weather