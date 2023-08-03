import {incrementVoteOf} from "../reducers/anecdoteReducer";
import {useDispatch, useSelector} from "react-redux";

const Anecdote = ({anecdote, addVote}) => {
    return (
        <div key={anecdote.id}>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={addVote}>vote</button>
            </div>
        </div>
    )
}

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => state)
    const vote = (id) => {
        dispatch(incrementVoteOf(id))
    }
    return (
        <div>
            {anecdotes.map(anecdote =>
                <Anecdote anecdote={anecdote} addVote={()=>vote(anecdote.id)} />
            )}
        </div>
    )
}

export default AnecdoteList