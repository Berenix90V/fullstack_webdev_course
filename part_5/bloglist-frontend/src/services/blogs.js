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
    const response = await axios.post(baseUrl, newObject, config)
    return response.data
}

const update = async (updateObject) => {
    const config ={
        headers: {Authorization: token}
    }
    const response = await axios.put(`${baseUrl}/${updateObject.id}`, updateObject, config)
    return response.data
}

const remove = async(blogId) => {
    const config = {
        headers: {Authorization: token}
    }
    const response = await axios.delete(`${baseUrl}/${blogId}`, config)
    return response.data
}

const blogService = {
    getAll,
    create,
    setToken,
    update,
    remove
}
export default blogService