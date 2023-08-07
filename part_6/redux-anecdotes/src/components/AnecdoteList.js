import {addAVoteToAnecdote} from "../reducers/anecdoteReducer";
import {useDispatch, useSelector} from "react-redux";
import {setNotificationForACertainTime} from "../reducers/notificationReducer";

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
    const vote = async (id, content) => {
        dispatch(addAVoteToAnecdote(id))
        dispatch(setNotificationForACertainTime(`You voted '${content}'`, 5000))
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