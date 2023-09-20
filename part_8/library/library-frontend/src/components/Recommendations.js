import {useQuery} from "@apollo/client";
import {ALL_BOOKS} from "../queries";

const Recommendations = ({show, favGenre}) => {
    const result = useQuery(ALL_BOOKS, {
        variables:{ genre: favGenre}
    })

    if(result.loading){
        return <div>data loading...</div>
    }
    if (!show) {
        return null
    }

    const books = result.data.allBooks

    return(
        <div>
            <h2>recommendations</h2>
            <p>books in your favorite genre <b>{favGenre}</b></p>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {books.map(b=>(
                        <tr key={b.title}>
                            <td>{b.title}</td>
                            <td>{b.author.name}</td>
                            <td>{b.published}</td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    )
}

export default Recommendations