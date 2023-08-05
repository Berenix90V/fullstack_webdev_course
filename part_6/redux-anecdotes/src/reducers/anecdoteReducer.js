import {createSlice} from "@reduxjs/toolkit";

const sortAnecdotes = (anecdotes) => {
    const anecdotesCopy = [...anecdotes]
    anecdotesCopy.sort((a,b) => b.votes-a.votes)
    return anecdotesCopy
}

const initialState = []

const anecdoteSlice = createSlice({
    name: 'anecdote',
    initialState,
    reducers: {
        addAnecdote(state, action){
            state.push(action.payload)
            sortAnecdotes(state)
        },
        incrementVoteOf(state, action){
            const id = action.payload
            const anecdoteToVote = state.find(n=>n.id===id)
            const changedAnecdote = {...anecdoteToVote, votes: anecdoteToVote.votes+1}
            const updatedAnecdotes = state.map(anecdote => anecdote.id===id? changedAnecdote : anecdote )
            return sortAnecdotes(updatedAnecdotes)
        },
        setAnecdotes(state, action) {
            return action.payload
        }
    }
})

export const {addAnecdote, incrementVoteOf, setAnecdotes} = anecdoteSlice.actions
export default anecdoteSlice.reducer