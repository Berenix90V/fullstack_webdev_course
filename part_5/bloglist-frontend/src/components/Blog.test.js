import React from 'react'
import Blog from './Blog'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import {render, screen} from '@testing-library/react'
import userEvent from "@testing-library/user-event";

describe('<Blog/>', () => {
    let renderResult
    beforeEach(() => {
        const blog ={
            title: 'Title',
            author: 'Author',
            url: 'https://www.blog.com',
            likes: 7,
            user: {
                name: 'Matti Luukkai',
                id: 'abc123'
            }
        }
        const mockUpdateBlog = jest.fn()
        const mockRemoveBlog = jest.fn()
        renderResult = render(<Blog blog={blog} userId={'abc123'} updateBlog={mockUpdateBlog} removeBlog={mockRemoveBlog} />)
    })
    test('renders author and title and additional information is hidden', () => {
        const title = screen.getByText("Title", {exact: false})
        const author = screen.getByText('Author', {exact: false})
        expect(title).not.toBeNull()
        expect(author).not.toBeNull()
        const url = screen.queryByText("https://www.blog.com")
        const likes = screen.queryByText("likes")
        expect(url).toBeNull()
        expect(likes).toBeNull()
        const moreInfoDiv = renderResult.container.querySelector('.additional-info')
        expect(moreInfoDiv).toHaveStyle({display: 'none'})
    })
})