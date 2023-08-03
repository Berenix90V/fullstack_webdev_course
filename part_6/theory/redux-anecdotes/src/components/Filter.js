const Filter = () => {
    const handleOnChange = (event) => {
        console.log(event.target.value)
    }
    return(
        <div>
            filter
            <input type="text" onChange={handleOnChange} />
        </div>
    )
}

export default Filter