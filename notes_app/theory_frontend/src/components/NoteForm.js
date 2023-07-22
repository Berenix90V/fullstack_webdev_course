const NoteForm = ({user, handleAddNote, newNote, handleNoteChange}) => {
    if(user){
        return (
            <form onSubmit={handleAddNote}>
                <input value={newNote} onChange={handleNoteChange}/>
                <button type="submit">save</button>
            </form>
        )
    }
}

export default NoteForm