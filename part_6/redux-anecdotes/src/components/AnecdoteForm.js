import {addAnecdote} from "../reducers/anecdoteReducer";
import {useDispatch} from "react-redux";
import {setNotification, unsetNotification} from "../reducers/notificationReducer";
import anecdoteService from "../services/anecdotes";

const AnecdoteForm = () => {
    const dispatch = useDispatch()
    const handleAddAnecdote = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        const newAnecdote = await anecdoteService.createNew(content)
        dispatch(addAnecdote(newAnecdote))
        dispatch(setNotification('Added new anecdote'))
        setTimeout(()=>dispatch(unsetNotification()), 5000)
    }
    return (
        <form onSubmit={handleAddAnecdote}>
            <div><input name="anecdote"/></div>
            <button type="submit">create</button>
        </form>
    )
}

export default AnecdoteForm