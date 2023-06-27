const Part = (props) => {
    return(
        <>
            <p>
                {props.part.name} {props.part.exercises}
            </p>
        </>
    )
}
const Header = (props) => {
  return (
        <h1>{props.course}</h1>
  )
}

const Content = (props) => {
    return (
        <>
            <Part part = {props.parts[0]} />
            <Part part = {props.parts[1]}  />
            <Part part = {props.parts[2]}  />
        </>
    )
}
const Total = (props) => {
    return (
        <p>Number of exercises {props.exercises1 + props.exercises2 + props.exercises3}</p>
    )
}
const App = () => {
  const course = 'Half Stack application development'
  const parts = [{
      name: 'Fundamentals of React',
      exercises: 10
  },
  {
      name: 'Using props to pass data',
      exercises: 7
  },
 {
      name:'State of a component',
      exercises: 14
  }]
  return(
      <div>
        <Header course = {course} />
        <Content parts = {parts} />
        <Total exercises1 = {parts[0].exercises} exercises2 = {parts[1].exercises} exercises3 = {parts[2].exercises} />
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
