const NoteForm = ({handleAddNote, newNote, handleNoteChange}) => {
    return (
        <form onSubmit={handleAddNote}>
            <input value={newNote} onChange={handleNoteChange}/>
            <button type="submit">save</button>
        </form>
    )

}

export default NoteForm