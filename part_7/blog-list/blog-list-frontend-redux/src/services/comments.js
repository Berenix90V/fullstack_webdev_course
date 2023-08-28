import axios from "axios";
const baseUrl = 'http://localhost:3000/blogs'

const getAll = async(blogId) => {
    const response = await axios.get(`${baseUrl}/${blogId}/comments`)
    return response.data
}

const commentsService = {
    getAll
}

export default commentsService