import {useEffect, useState} from "react";
import {useMutation} from "@apollo/client";
import {ALL_AUTHORS, EDIT_BIRTH_YEAR} from "../queries";
import Select from "react-select";

const SelectAuthor = ({authors, setAuthorName}) => {
    const [selectedOption, setSelectedOption ] = useState(null)
    let options = []
    authors.forEach(item => {
        options.push({value: item.name, label:item.name})
    })

    useEffect(()=>{
        if(selectedOption){
            setAuthorName(selectedOption.value)
        }
    }, [selectedOption])

    return(
        <Select onChange={setSelectedOption} options={options} defaultValue={selectedOption} />
    )
}


const BirthYearForm = ({authors}) => {
    const [ name, setName ] = useState('')
    const [ birthYear, setBirthYear ] = useState('')

    const [updateBirthYear, result] = useMutation(EDIT_BIRTH_YEAR, {
        refetchQueries: [{query: ALL_AUTHORS}]
    })


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
                <SelectAuthor authors={authors} setAuthorName={setName}/>
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