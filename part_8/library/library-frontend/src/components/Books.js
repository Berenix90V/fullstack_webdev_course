import {useQuery} from "@apollo/client";
import {ALL_BOOKS} from "../queries";
import {useState} from "react";

const Books = (props) => {
    const [genre, setGenre] = useState(null)
    const resultAllBooks = useQuery(ALL_BOOKS)
    const resultShownBooks = useQuery(ALL_BOOKS, {
        variables: {genre: genre},
        fetchPolicy: "no-cache"
    })

    if(resultAllBooks.loading || resultShownBooks.loading){
        return <div>data loading...</div>
    }
    if (!props.show) {
        return null
    }

    const books = resultAllBooks.data.allBooks
    const shownBooks = resultShownBooks.data.allBooks
    const genres = [...new Set(books.map(b => b.genres).flat())]

    return (
        <div>
            <h2>books</h2>

            <table>
                <tbody>
                <tr>
                    <th></th>
                    <th>author</th>
                    <th>published</th>
                </tr>
                {shownBooks.map((a) => (
                    <tr key={a.title}>
                        <td>{a.title}</td>
                        <td>{a.author.name}</td>
                        <td>{a.published}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            {genres.map(g=><button key={g} onClick={()=>setGenre(g)}>{g}</button>)}
            <button key="allGenres" onClick={()=> setGenre(null)}>all genres</button>
        </div>
    )
}

export default Books
