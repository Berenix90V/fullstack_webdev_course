import {cleanup, render, screen, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import App from "./App";
import {createStore} from "redux";
import reducer from "./reducer";
describe('App', function () {
    let renderedApp
    let store
    beforeEach(function () {
        store = createStore(reducer)
        renderedApp = render(<App store={store}/>)
    })
    test('shows 3 buttons to vote and 1 to reset', function () {
        const buttons = screen.getAllByRole('button')
        expect(buttons[0]).toHaveTextContent('good')
        expect(buttons[1]).toHaveTextContent('ok')
        expect(buttons[2]).toHaveTextContent('bad')
        expect(buttons[3]).toHaveTextContent('reset stats')
    })
    test('shows the initial state',  () => {
        const storeDivs = renderedApp.container.querySelectorAll('.store-info')
        expect(storeDivs).toHaveLength(3)
        expect(storeDivs[0]).toHaveTextContent('good 0')
        expect(storeDivs[1]).toHaveTextContent('ok 0')
        expect(storeDivs[2]).toHaveTextContent('bad 0')
    })

    describe('after modifying the store',  () => {
        test('pressing the button good changes only the good property', async  () => {
            const user = userEvent.setup()
            const goodButton = screen.getByText('good')
            await user.click(goodButton)
            expect(store.getState().good).toEqual(1)
            renderedApp = render(<App store={store}/>)
            const storeDivs = renderedApp.container.querySelectorAll('.store-info')
            expect(storeDivs[0]).toHaveTextContent('good 1')
            expect(storeDivs[1]).toHaveTextContent('ok 0')
            expect(storeDivs[2]).toHaveTextContent('bad 0')
        })

        test('pressing the button ok changes only the ok property', async  () => {
            const user = userEvent.setup()
            const okButton = screen.getByText('ok')
            await user.click(okButton)
            expect(store.getState().ok).toEqual(1)
            renderedApp = render(<App store={store}/>)
            const storeDivs = renderedApp.container.querySelectorAll('.store-info')
            expect(storeDivs[0]).toHaveTextContent('good 0')
            expect(storeDivs[1]).toHaveTextContent('ok 1')
            expect(storeDivs[2]).toHaveTextContent('bad 0')
        })

        test('pressing the button bad changes only the bad property', async  () => {
            const user = userEvent.setup()
            const badButton = screen.getByText('bad')
            await user.click(badButton)
            expect(store.getState().bad).toEqual(1)
            renderedApp = render(<App store={store}/>)
            const storeDivs = renderedApp.container.querySelectorAll('.store-info')
            expect(storeDivs[0]).toHaveTextContent('good 0')
            expect(storeDivs[1]).toHaveTextContent('ok 0')
            expect(storeDivs[2]).toHaveTextContent('bad 1')
        })
        test('pressing the button zero reset state', async  () => {
            const user = userEvent.setup()
            await user.click(screen.getByText('good'))
            await user.click(screen.getByText('good'))
            await user.click(screen.getByText('ok'))
            await user.click(screen.getByText('bad'))
            await user.click(screen.getByText('reset stats'))
            renderedApp = render(<App store={store}/>)
            let storeDivs = renderedApp.container.querySelectorAll('.store-info')
            expect(storeDivs[0]).toHaveTextContent('good 0')
            expect(storeDivs[1]).toHaveTextContent('ok 0')
            expect(storeDivs[2]).toHaveTextContent('bad 0')

        })
    })
});