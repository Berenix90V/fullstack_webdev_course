import {useState} from 'react'

const App = () => {
    const [leftClick, setLefClick] = useState(0)
    const [rightClick, setRightClick] = useState(0)
    const [allClicks, setAll] = useState([])
    const handleLeftClick = () => {
        setAll(allClicks.concat('L'))
        setLefClick(leftClick+1)
    }

    const handleRightClick = () => {
        setAll(allClicks.concat('R'))
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
