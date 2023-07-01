import {useState} from "react";

const Title = ({text}) => <h1>{text}</h1>
const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>
const DisplaySingleStat = ({text, value}) => <p>{text}: {value}</p>

const Statistics = ({good, neutral, bad})=>{
    const total = good+neutral+bad
    const average = total === 0? 0 : (good-bad)/total
    const positive = total === 0? 0: good*100/total
    return(
        <>
            <Title text='Statistics' />
            <DisplaySingleStat text='good' value={good} />
            <DisplaySingleStat text='neutral' value={neutral} />
            <DisplaySingleStat text='bad' value={bad} />
            <DisplaySingleStat text='all' value={total} />
            <DisplaySingleStat text='average' value={average} />
            <DisplaySingleStat text='positive' value={positive.toString()+' %'} />
        </>
    )

}
function App() {
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)
    return (
        <div >
            <Title text='Give your feedback' />
            <Button handleClick={()=>setGood(good+1)} text='Good'/>
            <Button handleClick={()=>setNeutral(neutral+1)} text='Neutral'/>
            <Button handleClick={()=>setBad(bad+1)} text='Bad' />
            <Statistics good={good} neutral={neutral} bad={bad} />

        </div>
  );
}

export default App;
