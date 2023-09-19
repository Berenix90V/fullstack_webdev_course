import Book from "./models/book.js";
import Author from "./models/author.js";
import User from "./models/user.js";
import jsonwebtoken from "jsonwebtoken";
import {GraphQLError} from "graphql/error/index.js";

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