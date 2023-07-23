import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
    token = `Bearer ${newToken}`
}

const getAll = async() => {
    // const request = axios.get(baseUrl)
    // return request.then(response => response.data)
    const response = await axios.get(baseUrl)
    return response.data
}

const create = async (newObject) => {
    const config ={
        headers: {Authorization: token}
    }
    console.log(config)
    const response = await axios.post(baseUrl, newObject, config)
    return response.data
}

const blogServices = {
    getAll,
    create,
    setToken
}
export default blogServices