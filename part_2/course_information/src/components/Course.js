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

export default Course