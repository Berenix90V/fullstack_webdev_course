export const reverse = (string) => {
    return string
        .split('')
        .reverse()
        .join('')
}

export const average = (array) => {
    const reducer = (sum, item) => {
        return sum + item
    }

    return array.length === 0? 0: array.reduce(reducer, 0) / array.length
}

const for_testing = {
    reverse,
    average
}
export default for_testing
