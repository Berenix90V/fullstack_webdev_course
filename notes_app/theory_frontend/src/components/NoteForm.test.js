import userEvent from "@testing-library/user-event";
import {render, screen} from "@testing-library/react";
import NoteForm from "./NoteForm";
import '@testing-library/jest-dom'

test('<NoteForm/> updates parent state and calls onSubmit', async () => {
    const createNote = jest.fn()
    const user = userEvent.setup()

    const renderResult = render(<NoteForm createNote={createNote} />)

    // const input = screen.getByPlaceholderText('write note content here')
    const input = renderResult.container.querySelector('#note-input')
    const sendButton = screen.getByText('save')
    await user.type(input, 'testing a form...')
    await user.click(sendButton)

    expect(createNote.mock.calls).toHaveLength(1)
    expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})
