import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import AddNewBlogForm from './AddNewBlogForm'

describe('BlogForm component', () => {
    let renderResult
    const mockCreateBlog = jest.fn()
    beforeEach(() => {
        renderResult = render(<AddNewBlogForm createBlog={mockCreateBlog} />)
    })

    test('calls the function to create a new Blog', async () => {
        const user = userEvent.setup()
        const createBlogButton =
            renderResult.container.querySelector('#create-blog')
        await user.click(createBlogButton)
        expect(mockCreateBlog.mock.calls).toHaveLength(1)
    })
})
