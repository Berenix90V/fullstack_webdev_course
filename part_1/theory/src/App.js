import {useState} from 'react'

const App = () => {
    const [leftClick, setLefClick] = useState(0)
    const [rightClick, setRightClick] = useState(0)
    const [allClicks, setAll] = useState([])
    const handleLeftClick = () => {
        allClicks.push('L')
        setAll(allClicks)
        setLefClick(leftClick+1)
    }

    const handleRightClick = () => {
        allClicks.push('R')
        setAll(allClicks)
        setRightClick(rightClick+1)
    }

    return(
        <div>
            {leftClick}
            <button onClick={handleLeftClick}>left</button>
            <button onClick={handleRightClick}>right</button>
            {rightClick}
            <p>{allClicks.join(' ')}</p>
        </div>
    )
}

export default App;
