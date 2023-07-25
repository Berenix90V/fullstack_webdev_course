import React from "react";
import Note from "./Note";
import '@testing-library/jest-dom/extend-expect'
import {render, screen} from "@testing-library/react";

test('renders content', () => {
    const note = {
        content: 'Component testing is done with react-testing-library',
        important: true
    }
    const {container} = render(<Note note={note} /> )

    const element = screen.getByText('Component testing is done with react-testing-library')
    expect(element).toBeDefined()
})