import axios from "axios";

const baseUrl = 'http://localhost:3001'
export const getNotes = () => {
    return axios.get(`${baseUrl}/notes`).then(res => res.data)
}

export const createNote = newNote => {
    return axios.post(`${baseUrl}/notes`, newNote).then(res => res.data)
}

export const updateNote = updatedNote => {
    return axios.put(`${baseUrl}/notes/${updatedNote.id}`, updatedNote).then(res => res.data)
}
