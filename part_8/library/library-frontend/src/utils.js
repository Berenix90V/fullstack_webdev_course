export const updateCache = (cache, query, addedBook) => {
    const uniqByTitle = (b) => {
        let seen = new Set()
        return b.filter((item) => {
            let k = item.title
            return seen.has(k)? false : seen.add(k)
        })
    }
    console.log(cache)
    cache.updateQuery({query:query}, ({allBooks}) => {
        return {
            allBooks: uniqByTitle(allBooks.concat(addedBook))
        }
    })
}