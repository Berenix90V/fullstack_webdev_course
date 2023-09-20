import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from "./components/LoginForm";
import {useApolloClient, useQuery, useSubscription} from "@apollo/client";
import {ALL_BOOKS, BOOK_ADDED, CURRENT_USER} from "./queries";
import Recommendations from "./components/Recommendations";
import {updateCache} from "./utils";

const App = () => {
    const [page, setPage] = useState('authors')
    const [token, setToken] = useState(null)
    const client = useApolloClient()
    const result = useQuery(CURRENT_USER)

    useSubscription(BOOK_ADDED,{
        onData: ({data}) => {
            const addedBook = data.data.bookAdded
            window.alert(`Added book: ${data.data.bookAdded.title}`)
            updateCache(client.cache, ALL_BOOKS, addedBook)
        }
    })

    const logout = () => {
        setToken(null)
        localStorage.clear()
        client.resetStore()
    }

    if(!token){
        return(
            <>
                <div>
                    <button onClick={() => setPage('authors')}>authors</button>
                    <button onClick={() => setPage('books')}>books</button>
                    <button onClick={() => setPage('login')}>login</button>
                </div>
                <Authors show={page === 'authors'} />

                <Books show={page === 'books'} />

                <LoginForm  show={page === 'login'} setToken={setToken} setHome={()=>setPage('authors')}/>
            </>
        )
    }

    const currentUser = result.data.me

    return (
        <div>
            <button onClick={logout}>logout</button>
            <div>
                <button onClick={() => setPage('authors')}>authors</button>
                <button onClick={() => setPage('books')}>books</button>
                <button onClick={() => setPage('add')}>add book</button>
                <button onClick={() => setPage('recommendations')}>recommended</button>
            </div>

            <Authors show={page === 'authors'} />

            <Books show={page === 'books'} />

            <NewBook show={page === 'add'} />

            <Recommendations show={page === 'recommendations'} favGenre={currentUser.favoriteGenre} />
        </div>
    )
}

export default App
