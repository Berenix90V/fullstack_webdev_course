import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import {useQuery} from "react-query";
import axios from "axios";

const App = () => {

  const handleVote = (anecdote) => {
    console.log('vote')
  }

  const result = useQuery(
      'notes',
      () => axios.get('http://localhost:3001/anecdotes').then(result => result.data),
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
  console.log(result)
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
