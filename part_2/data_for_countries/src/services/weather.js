import axios from "axios";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather"


const getWeather = (city, country)=>{
    const api_key = process.env.REACT_APP_WEATHER_API_KEY
    return axios
        .get(`${baseUrl}?q=${city},${country}&APPID=${api_key}`)
        .then(response => response.data)
}

const weatherServices = {getWeather}
export default weatherServices
