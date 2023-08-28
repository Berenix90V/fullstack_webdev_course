import commentsService from "../services/comments";

const initialState = []

const commentSlice = {
    name: 'comments',
    initialState,
    reducers: {
        setComments (state, action) {
            return action.payload
        },
        addComment (state, action) {
            return state.concat(action.payload)
        }
    }
}

export const { setComments, addComment } = commentSlice.actions

export const initializeComments = (blogId) => {
    return async dispatch => {
        const comments = await commentsService.getAll(blogId)
        dispatch(setComments(comments))
    }
}
export default commentSlice.reducer