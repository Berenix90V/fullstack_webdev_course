import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api"
const getAll = ()=>{
    return axios
        .get(`${baseUrl}/all`)
        .then(response=>response.data)
}

const countriesServices = {getAll}
export default countriesServices
