import './App.css';

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14
  return(
      <div>
        <h1>{course}</h1>
        <p>
          {part1} {exercises1}
        </p>
        <p>
          {part2} {exercises2}
        </p>
        <p>
          {part3} {exercises3}
        </p>
        <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>

      </div>
  )
}

/*
* Unfortunately, the entire application is in the same component.
* Refactor the code so that it consists of three new components: Header, Content, and Total.
* All data still resides in the App component, which passes the necessary data to each component using props.
* Header takes care of rendering the name of the course, Content renders the parts and their number of exercises
* and Total renders the total number of exercises.
*/
export default App;
