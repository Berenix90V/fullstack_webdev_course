const anecdotesAtStart = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
    return {
        content: anecdote,
        id: getId(),
        votes: 0
    }
}

const sortAnecdotes = (anecdotes) => {
    const anecdotesCopy = [...anecdotes]
    anecdotesCopy.sort((a,b) => b.votes-a.votes)
    return anecdotesCopy
}

const initialState = anecdotesAtStart.map(asObject)

const reducer = (state = initialState, action) => {
    console.log('state now: ', state)
    console.log('action', action)
    switch (action.type) {
        case 'ADD_VOTE':
            const id = action.payload.id
            const anecdoteToVote = state.find(n=>n.id===id)
            const changedAnecdote = {...anecdoteToVote, votes: anecdoteToVote.votes+1}
            const updatedAnecdotes = state.map(anecdote => anecdote.id===id? changedAnecdote : anecdote )
            return sortAnecdotes(updatedAnecdotes)
        case 'CREATE_ANECDOTE':
            const anecdotesWithNewAnecdote = state.concat(action.payload)
            return sortAnecdotes(anecdotesWithNewAnecdote)
        default:
            return state
    }
}

export const incrementVoteOf = (id) => {
    return {
        type: 'ADD_VOTE',
        payload: {id}
    }
}

export const createAnecdote = (content) => {
    return {
        type: 'CREATE_ANECDOTE',
        payload: { content, votes: 0, id: getId()}
    }
}

export default reducer