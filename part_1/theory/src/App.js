import {useState} from 'react'

const History = (props) => {
    if(props.allClicks.length === 0){
        return(
            <div>
                the app is used clicking buttons
            </div>
        )
    }
    else{
        return(
            <div>
                button press history: {props.allClicks.join(' ')}
            </div>
        )
    }
}

const Button = ({handleClick, text}) => {
    return(
        <button onClick={handleClick}>{text}</button>
    )
}

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
            <Button handleClick={handleLeftClick} text='left' />
            <Button handleClick={handleRightClick} text='right' />
            {rightClick}
            <History allClicks={allClicks}/>
            <p>Total: {total}</p>
        </div>
    )
}

export default App;
