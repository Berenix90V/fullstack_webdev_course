import {useMutation, useQueryClient} from "react-query";
import anecdoteServices from "../requests";
import {useNotificationDispatch} from "../notificationContext";

const AnecdoteForm = () => {
    const queryClient = useQueryClient()
    const dispatch = useNotificationDispatch()
    const newNoteMutation = useMutation(anecdoteServices.createNew, {
        onSuccess: (newAnecdote) => {
            const anecdotes = queryClient.getQueryData('anecdotes')
            queryClient.setQueryData('anecdotes', anecdotes.concat(newAnecdote))
        }
    })
    const onCreate = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        newNoteMutation.mutate({content, votes:0})

        dispatch({
            type: 'SET_NOTIFICATION',
            payload: `Added new anecdote ${content}`
        })
        setTimeout(()=>dispatch({type: 'UNSET_NOTIFICATION', payload: ''}), 5000)
    }

    return (
        <div>
            <h3>create new</h3>
            <form onSubmit={onCreate}>
                <input name='anecdote' />
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm
