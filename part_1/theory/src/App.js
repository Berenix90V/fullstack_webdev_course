
const Hello =({name, age}) => {
    const bornYear = () => new Date().getFullYear()-age

    return(
        <div>
            <p>
                Hello {name}, you are {age} years old
            </p>
            <p>
                So you were probably born in {bornYear()}
            </p>
        </div>
    )
}
const App = (props) => {
    const counter = props.counter
    const name = 'Peter'
    const age = 10
    return (
        <div>
            <h1>Greetings</h1>
            <p>{counter}</p>
            <Hello name="Maya" age={26 + 10} />
            <Hello name={name} age={age} />
        </div>
    )
}

export default App;
