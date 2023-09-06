import {gql} from '@apollo/client'
export const ALL_AUTHORS = gql`
    query {
         allAuthors{
            name
            born
            bookCount
        }
    }
`

export const ALL_BOOKS = gql`
    query {
        allBooks{
            author{
                name
                born
            }
            published
            title
            genres
        }
    }
`

export const CREATE_BOOK = gql`
   
    mutation createBook( $title: String!, $author: String!, $genres: [String!]!, $published: Int! ) {
      addBook(
        title: $title,
        author: $author,
        genres: $genres,
        published: $published
      ) {
            title
            author
            genres
            published
        }
    } 
`

export const EDIT_BIRTH_YEAR = gql`
    mutation editBirthYear( $name: String!, $setBornTo:Int! ) {
        editAuthor(name: $name, setBornTo: $setBornTo){
            name
            born
        }
    }
`

export const LOGIN = gql`
    mutation login($username: String!, $password: String!){
        login(username: $username, password: $password){
            value
        }
    }
`

export const CURRENT_USER = gql`
    query {
        me{
            favoriteGenre
            username
        }
    }
`