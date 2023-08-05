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
    const anecdotes = useSelector(state => {
        if(state.filter !== ''){
            return state.anecdotes.filter(a => a.content.includes(state.filter))
        } else{
            return state.anecdotes
        }
    })
    const vote = (id) => {
        dispatch(incrementVoteOf(id))
    }
    return (
        <div>
            {anecdotes.map(anecdote =>
                <Anecdote key={anecdote.id} anecdote={anecdote} addVote={()=>vote(anecdote.id)} />
            )}
        </div>
    )
}

export default AnecdoteList