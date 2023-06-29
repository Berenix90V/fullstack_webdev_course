import {useState} from 'react'

const App = () => {
    const [leftClick, setLefClick] = useState(0)
    const [rightClick, setRightClick] = useState(0)
    const [allClicks, setAll] = useState([])
    const [total, setTotal] = useState(0)
    const handleLeftClick = () => {
        setAll(allClicks.concat('L'))
        const updateLeft = leftClick+1
        setLefClick(updateLeft)
        setTotal(updateLeft+rightClick)
    }

    const handleRightClick = () => {
        setAll(allClicks.concat('R'))
        const updateRight = rightClick+1
        setRightClick(updateRight)
        setTotal(leftClick+updateRight)
    }

    return(
        <div>
            {leftClick}
            <button onClick={handleLeftClick}>left</button>
            <button onClick={handleRightClick}>right</button>
            {rightClick}
            <p>Click sequence: {allClicks.join(' ')}</p>
            <p>Total: {total}</p>
        </div>
    )
}

export default App;
