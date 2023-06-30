import {useState} from 'react'

const App = () => {
    const [value, setValue] = useState(10)
    const setToValue = (newValue)=>()=>{
        console.log('Value now', newValue)
        setValue(newValue)
    }
    return(
        <div>
            {value}
            <button onClick={setToValue(1000)} >1000</button>
            <button onClick={setToValue(0)} >reset</button>
            <button onClick={setToValue(value+1)} >plus</button>
        </div>

    )
}

export default App;
