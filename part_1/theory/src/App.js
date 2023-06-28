import {useState} from 'react'
const App = () => {
    const handleClick = ()=>{
        console.log('clicked')
    }

    return (
        <div>
            <button onClick={handleClick}>plus</button>
        </div>
    )
}

export default App;
