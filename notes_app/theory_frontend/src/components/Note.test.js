import React from 'react'
import Note from './Note'
import '@testing-library/jest-dom/extend-expect'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('renders content', () => {
    const note = {
        content: 'Component testing is done with react-testing-library',
        important: true
    }
    const {container} = render(<Note note={note} /> )

    const element = screen.getByText('Component testing is done with react-testing-library')
    expect(element).toBeDefined()
    const div = container.querySelector('.note')
    expect(div).toHaveTextContent('Component testing is done with react-testing-library')
})

test('clicking the button calls event handler once', async () => {
    const note = {
        content: 'Component testing is done with react-testing-library',
        important: true
    }
    const mockHandler = jest.fn()
    const user = userEvent.setup()
    render(<Note note={note} toggleImportance={mockHandler()} />)


    const button = screen.getByText('make not important')
    await user.click(button)
    expect(mockHandler.mock.calls).toHaveLength(1)
})