import React from 'react'
import Blog from './Blog'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
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
        const mockUpdateBlog = jest.fn()
        const mockRemoveBlog = jest.fn()
        const renderResult = render(<Blog blog={blog} userId={'abc123'} updateBlog={mockUpdateBlog} removeBlog={mockRemoveBlog} />)
    })
    test('renders author and title', () => {
        const title = screen.queryByText('Title')
        const author = screen.queryByText('Author')
        expect(title).not.toBeNull()
        expect(author).not.toBeNull()
    })
})