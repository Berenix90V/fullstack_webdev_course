const App = ({store}) => {
    const good = () => {
        store.dispatch({
            type: 'GOOD'
        })
    }
    const ok = () => {
        store.dispatch({
            type: 'OK'
        })
    }

    const bad = () => {
        store.dispatch({
            type: 'BAD'
        })
    }

    const reset = () => {
        store.dispatch({
            type: 'ZERO'
        })
    }

    return (
        <div>
            <button onClick={good} id='good-button'>good</button>
            <button onClick={ok} id='ok-button'>ok</button>
            <button onClick={bad} id='bad-button'>bad</button>
            <button onClick={reset} id='reset-button'>reset stats</button>
            <div className="store-info">good {store.getState().good}</div>
            <div className="store-info">ok {store.getState().ok}</div>
            <div className="store-info">bad {store.getState().bad}</div>
        </div>
    )
}

export default App