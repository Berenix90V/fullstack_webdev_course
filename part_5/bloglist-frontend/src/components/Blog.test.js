import React from 'react'
import Blog from './Blog'
import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'

describe('<Blog/>', () => {
    let renderResult
    const mockUpdateBlog = jest.fn()
    const mockRemoveBlog = jest.fn()
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
    test('renders url and likes if the user click the button to expand the information', async () => {
        const moreInfoDivBefore = renderResult.container.querySelector('.additional-info')
        const expandButton = renderResult.container.querySelector('#expand-button')
        const user = userEvent.setup()
        await user.click(expandButton)
        const urlAfter = screen.queryByText("https://www.blog.com", {exact: false})
        const likesAfter = screen.queryByText("likes", {exact: false})
        expect(urlAfter).not.toBeNull()
        expect(likesAfter).not.toBeNull()
        const moreInfoDivAfter = renderResult.container.querySelector('.additional-info')
        expect(moreInfoDivAfter).not.toHaveStyle({display: 'none'})
    })

    test('increase 2 likes if button is clicked twice', async () => {
        const user = userEvent.setup()
        const addLikesButton = renderResult.container.querySelector('#add-like')
        const likesElement = screen.queryByText('likes', {exact: false})
        expect(likesElement).toHaveAttribute('id', 'likes')
        await user.click(addLikesButton)
        await user.click(addLikesButton)
        expect(mockUpdateBlog.mock.calls).toHaveLength(2)
    })
})
