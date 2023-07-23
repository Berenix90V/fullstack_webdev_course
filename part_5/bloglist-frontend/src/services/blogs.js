import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
    token = `Bearer ${token}`
}

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = (newObject) => {
    const config ={
        headers: {Authorization: token}
    }
    const request = axios.post(baseUrl, newObject, config)
    return request.then(response => response.data)
}

const blogServices = {
    getAll,
    create
}
export default blogServices