import axios from "axios";

const baseUrl = 'http://localhost:3001'
export const getNotes = () => {
    axios.get(`${baseUrl}/notes`).then(res => res.data)
}