import {useState} from "react";

export const useField = (type, name) => {
  const [value, setValue] = useState('')

  const onChange = event => {
    setValue(event.target.value)
  }

  const resetValue = () => {
    setValue('')
  }

  return {
    type,
    name,
    value,
    onChange,
    resetValue
  }
}