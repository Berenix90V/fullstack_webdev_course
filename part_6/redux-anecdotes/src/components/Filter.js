import {useDispatch} from "react-redux";
import {filterChange} from "../reducers/filterReducer";

const Filter = () => {
    const dispatch = useDispatch()
    return(
        <div>
            filter
            <input type="text" onChange={(event)=>dispatch(filterChange(event.target.value))} />
        </div>
    )
}

export default Filter