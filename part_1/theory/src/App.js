import {useState} from 'react'
const App = (props) => {
    const [counter, setCounter] = useState(0)
    setTimeout(()=>setCounter(counter+1), 1000)

    console.log('rendering...', counter)

    return (
        <div>
            <p>{counter}</p>
        </div>
    )
}

export default App;
