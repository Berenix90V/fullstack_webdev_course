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
            <Part part = {props.part1} />
            <Part part = {props.part2}  />
            <Part part = {props.part3}  />
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
  const part1 = {
      name: 'Fundamentals of React',
      exercises: 10
  }
  const part2 = {
      name: 'Using props to pass data',
      exercises: 7
  }
  const part3 = {
      name:'State of a component',
      exercises: 14
  }
  return(
      <div>
        <Header course = {course} />
        <Content
            part1 = {part1}
            part2 = {part2}
            part3 = {part3}  />
        <Total exercises1 = {part1.exercises} exercises2 = {part2.exercises} exercises3 = {part3.exercises} />
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
