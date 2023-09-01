import {useQuery} from "@apollo/client";
import {ALL_AUTHORS} from "../queries";
import BirthYearForm from "./BirthYearForm";
import {useState} from "react";

const Notification = ({notification}) => {
    return(
        <div>
            {notification}
        </div>
    )
}

const Authors = (props) => {

    const result = useQuery(ALL_AUTHORS)
    const [ notification, setNotification ] = useState('')

    if (!props.show) {
        return null
    }
    if(result.loading){
        return <div>data loading ... </div>
    }
    const authors =  result.data.allAuthors

    const notify = (message) => {
        setNotification(message)
        setTimeout(() => {
            setNotification('')
        }, 5000)
    }

    return (
        <div>
            <h2>authors</h2>
                {notification!== '' && <Notification notification={notification}/>}
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>born</th>
                        <th>books</th>
                    </tr>
                    {authors.map((a) => (
                        <tr key={a.name}>
                            <td>{a.name}</td>
                            <td>{a.born}</td>
                            <td>{a.bookCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>Set birth year</h2>
            <BirthYearForm setError={notify}/>
        </div>
    )
}

export default Authors
