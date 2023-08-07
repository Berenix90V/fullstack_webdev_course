import axios from "axios";

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll =  () => {
    return axios.get(`${baseUrl}`).then(response => response.data)
}

const anecdoteServices = {getAll}
export default anecdoteServices