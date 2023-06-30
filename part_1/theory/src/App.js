import {useState} from 'react'

const Button = ({handleClick, text}) => {
    return(
        <button onClick={handleClick}>
            {text}
        </button>
    )
}
const App = () => {
    const [value, setValue] = useState(10)
    const setToValue = (newValue)=>()=>{
        console.log('Value now', newValue)
        setValue(newValue)
    }
    return(
        <div>
            {value}
            <Button handleClick={setToValue(1000)} text={1000} />
            <Button handleClick={setToValue(0)} text={'reset'} />
            <Button handleClick={setToValue(value+1)} text={'plus'} />
        </div>

    )
}

export default App;
