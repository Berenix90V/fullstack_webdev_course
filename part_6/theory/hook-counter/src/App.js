import {useReducer} from 'react'
import Display from "./components/Display";
import Button from "./components/Button";



const App = () => {
    const [counter, counterDispatch] = useReducer(counterReducer, 0)

    return (
        <div>
            <Display counter={counter}/>
            <div>
                <Button dispatch={counterDispatch} type='INC' label='+' />
                <Button dispatch={counterDispatch} type='DEC' label='-' />
                <Button dispatch={counterDispatch} type='ZERO' label='0' />
            </div>
        </div>
    )
}

export default App