import mongoose from "mongoose";
import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import config from "./utils/config.js"
import Book from './models/book.js'
import Author from './models/author.js'
import {GraphQLError} from "graphql/error/index.js";
import User from "./models/user.js";
import jsonwebtoken from 'jsonwebtoken'

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
    type User {
        username: String!
        favoriteGenre: String!
        id: ID!
    }
    
    type Token {
        value: String!
    }
     
    type Author {
        name: String!
        born: Int
        id: ID!
        bookCount: Int!
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
        me: User
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
        createUser(
            username: String!
            favoriteGenre: String!
        ): User
        login(
            username: String!
            password: String!
        ): Token
    }
`

const resolvers = {
    Author: {
        name: (root) => root.name,
        id: (root) => root.id,
        bookCount: async (root) => await Book.count({author: root.id})
    },
    Book: {
        title: (root) => root.title,
        author: async (root) => await Author.findById(root.author.toString()),
        published: (root) => root.published,
        genres: (root) => root.genres
    },
    Query: {
        bookCount: async () => await Book.count(),
        authorCount: async () => await Author.count(),
        allBooks: async (root, args) => {
            let shownBooks = await Book.find({})
            if(args.author){
                const author = await Author.findOne({name: args.author})
                shownBooks = await Book.find({author: author._id})
            }
            if (args.genre){
                shownBooks = await Book.find({genres: args.genre})
            }
            return shownBooks

        },
        allAuthors: async () => await Author.find({}),
        me: (root, args, context) => context.currentUser
    },
    Mutation: {
        addBook: async (root, args, context) => {
            const currentUser = context.currentUser
            if(!currentUser){
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                })
            }
            const {author, ...bookProps} = args
            let authorObj = await Author.findOne({name:author})
            if(!authorObj){
                const newAuthor = new Author({
                    name: author,
                    born: null
                })
                try{
                    authorObj = await newAuthor.save()
                } catch(error){
                    throw new GraphQLError('Saving author failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.author,
                            error
                        }
                    })
                }

            }
            const book = new Book({...bookProps, author: authorObj._id})
            let savedBook = null
            try{
                savedBook = await book.save()
            }catch(error){
                throw new GraphQLError('Saving book failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.title,
                        error
                    }
                })
            }
            return savedBook

        },
        addAuthor: async (root, args, context) => {
            const currentUser = context.currentUser
            if(!currentUser){
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                })
            }
            const author = new Author({...args})
            let savedAuthor = null
            try{
                savedAuthor = await author.save()
            } catch (error){
                throw new GraphQLError('Saving author failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error
                    }
                })
            }
            return savedAuthor
        },
        editAuthor: async (root, args, context) => {
            const currentUser = context.currentUser
            if(!currentUser){
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                })
            }
            const author = await Author.findOne({name: args.name})
            if (author){
                author.born = args.setBornTo
                try{
                    return await author.save()
                } catch (error) {
                    throw new GraphQLError('Updating author failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.name,
                            error
                        }
                    })
                }

            } else{
                return null
            }
        },
        createUser: async(root, args) => {
            const user = new User({...args})
            return user.save()
                .catch(error => {
                    throw new GraphQLError('Creating the user failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.username,
                            error
                        }
                    })
                })
        },
        login: async(root, args) => {
            const user = await User.findOne({username: args.username})
            if(!user || args.password !== 'secret') {
                throw new GraphQLError('wrong credentials', {
                    extensions:{
                        code: 'BAD_USER_INPUT'
                    }
                })
            }
            const userForToken = {
                username: user.username,
                id: user._id
            }

            return {value: jsonwebtoken.sign(userForToken, process.env.JWT_SECRET)}
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({req, res}) => {
        const auth = req? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')){
            const decodedToken = jsonwebtoken.verify(auth.substring(7), process.env.JWT_SECRET)
            const currentUser = await User.findById(decodedToken.id)
            return {currentUser}
        }
    }
}).then(({ url }) => {
    console.log(`Server ready at ${url}`)
})