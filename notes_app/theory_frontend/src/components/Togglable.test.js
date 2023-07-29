import React from "react";
import {render, screen} from "@testing-library/react";
import Togglable from "./Togglable";
import '@testing-library/jest-dom'
import userEvent from "@testing-library/user-event";

describe('<Togglable/>', () => {
    let renderResult
    beforeEach(() => {
        renderResult = render(
            <Togglable buttonLabel="show...">
                <div className="testDiv">
                    togglable content
                </div>
            </Togglable>

        )
    })

    test('render its children', async () => {
        await screen.findAllByText('togglable content')
    })

    test('at start the children are not displayed', () => {
        const div = renderResult.container.querySelector('.togglableContent')
        screen.debug(div)
        expect(div).toHaveStyle('display: none')
    })

    test('after clicking the button, children are displayed', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('show...')
        await user.click(button)

        const div = renderResult.container.querySelector('.togglableContent')
        expect(div).not.toHaveStyle('display: none')
    })
    test('toggled content can be closed', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('show...')
        await user.click(button)
        const closeButton = screen.getByText('cancel')
        await user.click(closeButton)
        const div = renderResult.container.querySelector('.togglableContent')
        expect(div).toHaveStyle('display: none')
    })
})