import {useState} from 'react'
const App = () => {
    const [counter, setCounter] = useState(0)
    const increaseByOne = ()=>setCounter(counter+1)
    const setToZero = ()=>setCounter(0)
    return (
        <div>
            <p>{counter}</p>
            <button onClick={increaseByOne}>plus</button>
            <button onClick={setToZero}>reset</button>
        </div>
    )
}

export default App;
