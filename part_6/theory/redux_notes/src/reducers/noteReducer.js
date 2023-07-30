const noteReducer = (state=[], action) => {
    if (action.type==='NEW_NOTE'){
        return state.concat(action.payload)
    }
}
export default noteReducer