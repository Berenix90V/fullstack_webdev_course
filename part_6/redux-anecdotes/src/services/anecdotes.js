import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const getAnecdoteById =  async (id) => {
    const response = await axios.get(`${baseUrl}/${id}`)
    return response.data
}

const createNew = async (content) => {
    const anecdoteObject = {
        content: content,
        votes: 0
    }
    const response = await axios.post(baseUrl, anecdoteObject)
    return response.data
}

const addAVoteToAnecdote = async (id) => {
    const originalAnecdoteObject = await getAnecdoteById(id)
    const updatedAnecdoteObject = {...originalAnecdoteObject, votes: originalAnecdoteObject.votes+1}
    const response = await axios.put(`${baseUrl}/${id}`, updatedAnecdoteObject)
    return response.data
}

const anecdoteService = {
    getAll, createNew, addAVoteToAnecdote, getAnecdoteById
}

export default anecdoteService
