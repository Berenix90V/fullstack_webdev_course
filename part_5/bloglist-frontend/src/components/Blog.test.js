import React from 'react'
import Blog from '/Blog'
import '@testing-library/jest-dom'
import {render, screen} from '@testing-library/react'
import userEvent from "@testing-library/user-event";

describe('<Blog/>', () => {
    beforeEach(() => {
        const blog ={
            title: 'Title',
            author: 'Author',
            url: 'https://www.blog.com',
            likes: 7
        }
        const renderResult = render(<Blog blog={blog} userId={'abc123'}/>)
    })
    test('renders author and title', () => {
        const user = userEvent.setup()
    })
})