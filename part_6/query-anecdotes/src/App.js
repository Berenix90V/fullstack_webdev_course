import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import {useMutation, useQuery, useQueryClient} from "react-query";
import anecdoteServices from "./requests";
import {useNotificationDispatch} from "./notificationContext";

const App = () => {
    const queryClient = useQueryClient()
    const dispatch = useNotificationDispatch()
    const updateMutation = useMutation(anecdoteServices.updateAnecdote, {
        onSuccess: (updatedAnecdote) => {
            const anecdotes = queryClient.getQueryData('anecdotes')
            queryClient.setQueryData('anecdotes', anecdotes.map(a => a.id === updatedAnecdote.id? updatedAnecdote : a))
        }
    })

    const handleVote = (anecdote) => {
        updateMutation.mutate({...anecdote, votes:anecdote.votes+1})

        dispatch({
            type: 'SET_NOTIFICATION',
            payload: `You voted for ${anecdote.content}`
        })
        setTimeout(()=>dispatch({type: 'UNSET_NOTIFICATION', payload: ''}), 5000)
    }

    const result = useQuery(
      'anecdotes',
        anecdoteServices.getAll,
        {
            retry: 1
        }
    )

    if(result.isLoading){
        return(
            <div>data is loading ...</div>
        )
    }

    if(result.status === 'error'){
        return(
            <div>anecdote service not available due to problems in server</div>
        )
    }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
