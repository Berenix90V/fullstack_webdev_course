const Part = ({part}) => {
  return(
      <p>{part.name} {part.exercises}</p>
  )
}

const Header = ({title}) => {
  return(
      <h1>{title}</h1>
  )
}

const Content = ({parts}) =>{
  return(
      <>
        {parts.map((part) => <Part key={part.id} part={part}/>)}
      </>
  )
}
const Total = ({total}) => {
  return (
      <p><b>Total of {total} exercises</b></p>
  )
}

const Course = ({course}) => {
  return(
      <>
        <Header title={course.name}/>
        <Content parts={course.parts}/>
        <Total total={course.parts.reduce((sum, part)=>sum+part.exercises, 0)} />
      </>
  )
}
const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      }
    ]
  }
  return (
    <Course course={course}/>
  );
}

/*
exercise 2.3 require reduce, but already done with that
 */

export default App;
