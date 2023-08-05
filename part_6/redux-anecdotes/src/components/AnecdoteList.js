import {incrementVoteOf} from "../reducers/anecdoteReducer";
import {useDispatch, useSelector} from "react-redux";
import {setNotification, unsetNotification} from "../reducers/notificationReducer";

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
    const vote = (id, content) => {
        dispatch(incrementVoteOf(id))
        dispatch(setNotification(`you voted '${content}'`))
        setTimeout(()=>dispatch(unsetNotification()), 5000)
    }
    return (
        <div>
            {anecdotes.map(anecdote =>
                <Anecdote key={anecdote.id} anecdote={anecdote} addVote={()=>vote(anecdote.id, anecdote.content)} />
            )}
        </div>
    )
}

export default AnecdoteList