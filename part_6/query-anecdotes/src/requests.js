import axios from "axios";

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll =  () => {
    return axios.get(`${baseUrl}`).then(response => response.data)
}

const createNew = (newAnecdote) => {
    if(newAnecdote.content.length >= 5){
        return axios.post(`${baseUrl}`, newAnecdote).then(response => response.data)
    }
}

const updateAnecdote = (updatedAnecdote) => {
    if(updatedAnecdote.content.length >= 5){
        return axios.put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote).then(response=>response.data)
    }
}

const anecdoteServices = {getAll, createNew, updateAnecdote}
export default anecdoteServices