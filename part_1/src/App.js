
const App = () => {
    const friends = [
        { name: 'Peter', age: 24 },
        { name: 'Maya', age:25 }
    ]
    const name = 'Peter'
    const age = 24
    return (
        <>
            <h1>Greetings</h1>
            <p>{friends[0]}</p>
            <p>{friends[1]}</p>
        </>
    )
}

export default App;
