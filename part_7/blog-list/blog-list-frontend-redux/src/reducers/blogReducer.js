import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const initialState = []

const blogSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
        setBlogs(state, action){
            return action.payload
        },
        createBlog(state, action){
            return state.concat(action.payload)
        }
    }
})

export const { setBlogs, createBlog } = blogSlice.actions

export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogService.getAll()
        blogs.sort((a, b) => b.likes - a.likes)
        dispatch(setBlogs(blogs))
    }
}

export const addNewBlog = (content) => {
    return async dispatch => {
        const newBlog = await blogService.create(content)
        const newBlogWithUser = await blogService.getById(newBlog.id)
        dispatch(createBlog(newBlogWithUser))
    }
}

export const updateBlog = (blogObject) => {
    return async dispatch => {
        await blogService.update(blogObject)
        const updatedBlogs = await blogService.getAll()
        updatedBlogs.sort((a, b) => b.likes - a.likes)
        dispatch(setBlogs(updatedBlogs))
    }
}

export const removeBlog = (blogId) => {
    return async dispatch => {
        await blogService.remove(blogId)
        const updatedBlogs = await blogService.getAll()
        updatedBlogs.sort((a, b) => b.likes - a.likes)
        dispatch(setBlogs(updatedBlogs))
    }
}

export const addCommentToBlog = (commentObject) => {
    return async () => {
        await blogService.addComment(commentObject.blog, commentObject)
    }
}
export default blogSlice.reducer