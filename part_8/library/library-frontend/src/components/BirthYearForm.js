import {useEffect, useState} from "react";
import {useMutation} from "@apollo/client";
import {ALL_AUTHORS, EDIT_BIRTH_YEAR} from "../queries";

const BirthYearForm = ({ setError }) => {
    const [ name, setName ] = useState('')
    const [ birthYear, setBirthYear ] = useState('')

    const [updateBirthYear, result] = useMutation(EDIT_BIRTH_YEAR, {
        refetchQueries: [{query: ALL_AUTHORS}]
    })

    useEffect(() => {
        if(result.data && !result.data.editAuthor) {
            setError('author not found')
        }
    }, [result.data])

    const submit = async (event) => {
        event.preventDefault()
        await updateBirthYear({variables: {name, setBornTo: parseInt(birthYear)}})
        setName('')
        setBirthYear('')
    }
    return (
        <form onSubmit={submit}>
            <div>
                name
                <input
                    value={name}
                    name="name"
                    onChange={(event) => setName(event.target.value)}
                />
            </div>
            <div>
                born
                <input
                    value={birthYear}
                    name="birth-year"
                    onChange={(event) => setBirthYear(event.target.value)}
                />
            </div>
            <button type="submit">update author</button>
        </form>
    )
}

export default BirthYearForm