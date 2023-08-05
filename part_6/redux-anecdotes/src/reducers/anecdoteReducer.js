import {createSlice} from "@reduxjs/toolkit";

const anecdotesAtStart = []

//const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
    return {
        content: anecdote,
        votes: 0
    }
}

const sortAnecdotes = (anecdotes) => {
    const anecdotesCopy = [...anecdotes]
    anecdotesCopy.sort((a,b) => b.votes-a.votes)
    return anecdotesCopy
}

const initialState = anecdotesAtStart.map(asObject)

const anecdoteSlice = createSlice({
    name: 'anecdote',
    initialState,
    reducers: {
        createAnecdote(state, action){
            const anecdotesWithNewAnecdote = state.concat(asObject(action.payload))
            return sortAnecdotes(anecdotesWithNewAnecdote)
        },
        incrementVoteOf(state, action){
            const id = action.payload
            const anecdoteToVote = state.find(n=>n.id===id)
            const changedAnecdote = {...anecdoteToVote, votes: anecdoteToVote.votes+1}
            const updatedAnecdotes = state.map(anecdote => anecdote.id===id? changedAnecdote : anecdote )
            return sortAnecdotes(updatedAnecdotes)
        }
    }
})

export const {createAnecdote, incrementVoteOf} = anecdoteSlice.actions
export default anecdoteSlice.reducer