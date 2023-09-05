import mongoose from "mongoose";
import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import config from "./utils/config.js"
import Book from './models/book.js'
import Author from './models/author.js'

mongoose.connect(config.mongodb_url)
    .then(() => {
        console.log('connecting to', config.mongodb_url)
    })
    .catch((error) => {
        console.log('error connection to MongoDB: ', error.message)
    })

// let authors = [
//     {
//         name: 'Robert Martin',
//         id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//         born: 1952,
//     },
//     {
//         name: 'Martin Fowler',
//         id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//         born: 1963
//     },
//     {
//         name: 'Fyodor Dostoevsky',
//         id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//         born: 1821
//     },
//     {
//         name: 'Joshua Kerievsky', // birthyear not known
//         id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//     },
//     {
//         name: 'Sandi Metz', // birthyear not known
//         id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//     },
// ]

/*
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
*/
//
// let books = [
//     {
//         title: 'Clean Code',
//         published: 2008,
//         author: 'Robert Martin',
//         id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//         genres: ['refactoring']
//     },
//     {
//         title: 'Agile software development',
//         published: 2002,
//         author: 'Robert Martin',
//         id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//         genres: ['agile', 'patterns', 'design']
//     },
//     {
//         title: 'Refactoring, edition 2',
//         published: 2018,
//         author: 'Martin Fowler',
//         id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//         genres: ['refactoring']
//     },
//     {
//         title: 'Refactoring to patterns',
//         published: 2008,
//         author: 'Joshua Kerievsky',
//         id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//         genres: ['refactoring', 'patterns']
//     },
//     {
//         title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//         published: 2012,
//         author: 'Sandi Metz',
//         id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//         genres: ['refactoring', 'design']
//     },
//     {
//         title: 'Crime and punishment',
//         published: 1866,
//         author: 'Fyodor Dostoevsky',
//         id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//         genres: ['classic', 'crime']
//     },
//     {
//         title: 'The Demon',
//         published: 1872,
//         author: 'Fyodor Dostoevsky',
//         id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//         genres: ['classic', 'revolution']
//     },
// ]

/*
  you can remove the placeholder query once your first one has been implemented
*/

const typeDefs = `   
    type Author {
        name: String!
        born: Int
        id: ID!
    }
    
    type Book {
        title: String!
        published: Int!
        author: Author!
        id: ID!
        genres: [String!]!
    }

    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
    }
    
    type Mutation {
        addBook(
            title: String!
            author: String!
            genres: [String!]!
            published: Int!
        ): Book
        editAuthor(
            name: String!
            setBornTo: Int!
        ): Author
        addAuthor(
            name: String!
            born: Int
        ): Author
    }
`

const resolvers = {
    Author: {
        name: (root) => root.name,
        id: (root) => root.id
    },
    Book: {
        title: (root) => root.title,
        author: async (root) => await Author.findById(root.author.toString()),
        published: (root) => root.published,
        genres: (root) => root.genres
    },
    Query: {
        bookCount: () => Book.count(),
        authorCount: () => Author.count(),
        allBooks: async (root, args) => {
            let shownBooks = await Book.find({})
            console.log(args)
            if(args.author){
                const author = await Author.findOne({name: args.author})
                shownBooks = await Book.find({author: author._id})
            }
            if (args.genre){
                console.log(args.genre)
                shownBooks = await Book.find({genres: args.genre})
            }
            return shownBooks

        },
        allAuthors: () => Author.find({})
    },
    Mutation: {
        addBook: async (root, args) => {
            const {author, ...bookProps} = args

            let authorObj = await Author.findOne({name:author})
            if(!authorObj){
                const newAuthor = new Author({
                    name: author,
                    born: null
                })
                authorObj = await newAuthor.save()
            }
            const book = new Book({...bookProps, author: authorObj._id})
            return book.save()
        },
        editAuthor: (root, args) => {
            console.log('edit author')
            // const author = authors.find(a => a.name === args.name)
            // if (author){
            //     const updatedAuthor = {...author, born: args.setBornTo}
            //     authors = authors.map(a => a.name === args.name? updatedAuthor : a)
            //     return updatedAuthor
            // } else{
            //     return null
            // }
        },
        addAuthor: (root, args) => {
            const author = new Author({...args})
            return author.save()
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

startStandaloneServer(server, {
    listen: { port: 4000 },
}).then(({ url }) => {
    console.log(`Server ready at ${url}`)
})