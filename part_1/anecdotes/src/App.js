import {useState} from "react";

const Button = ({handleClick, text})=><button onClick={handleClick}>{text}</button>
function App() {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  const [selected, setSelected] = useState(0)
  const handleVotes =()=>{
    const newVotes = [...votes]
    newVotes[selected] += 1
    console.log(newVotes[selected])
    setVotes(newVotes)
  }

  /**
   *
   * @param min : int minimum integer possible (inclusive)
   * @param max : int  maximum integer possible (inclusive)
   * @returns {int}
   */
  function getRandomInt(min, max){
    max=max+1
    const randomInt = Math.floor(Math.random()*(max-min)+min)
    return randomInt
  }
  return (
    <>
      <div>
        <p>{anecdotes[selected]}</p>
        <p>Has {votes[selected]} votes</p>
      </div>
      <Button handleClick={()=>handleVotes()} text='Vote'/>
      <Button handleClick={()=>setSelected(getRandomInt(0, anecdotes.length-1))} text='Next anecdote'></Button>
    </>
  );
}

export default App;
