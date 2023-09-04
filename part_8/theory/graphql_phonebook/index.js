import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {GraphQLError} from 'graphql'
import mongoose from "mongoose";
import config from "./utils/config.js";
import Person from "./models/person.js"
import User from "./models/user.js";
import jsonwebtoken from 'jsonwebtoken'

mongoose.set('strictQuery', false)

mongoose.connect(config.mongodb_url)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })


const typeDefs = `
  type User {
    username: String!
    friends: [Person!]!
    id: ID!
  }
  
  type Token {
    value: String!
  }
  
  type Address {
    street: String!
    city: String! 
  }

  enum YesNo {
    YES
    NO
  }
  
  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
    me: User
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person!]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person

    editNumber(
      name: String!
      phone: String!
    ): Person
    
    createUser(
      username: String!
    ): User
    
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
    Person: {
        address: (root) => {
            return {
                street: root.street,
                city: root.city,
            }
        },
    },

    Query: {
        personCount: async() => Person.collection.countDocuments(),
        allPersons: async (root, args) => {
            if(!args.phone){
                return Person.find({})
            }
            return Person.find({phone: {$exists: args.phone === 'YES'}})
        },
        findPerson: async (root, args) => Person.findOne({ name: args.name }),
        me: (root, args, context) => {
            return context.currentUser
        }
    },

    Mutation: {
        addPerson: async (root, args) => {
            const person = new Person({...args})
            try{
                await person.save()
            } catch(error){
                throw new GraphQLError('Saving person failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error
                    }
                })
            }
        },
        editNumber: async (root, args) => {
            const person = await Person.find({name: args.name})
            person.phone = args.phone

            try{
                await person.save()
            } catch(error){
                throw new GraphQLError('Saving number failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error
                    }
                })
            }
        },
        createUser: async (root, args) => {
            const user = new User({username: args.username})
            return user.save()
                .catch(error => {
                    throw new GraphQLError('Creating the user failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.name,
                            error
                        }
                    })
                })
        },
        login: async (root, args) => {
            const user = await User.findOne({username: args.username})

            if( !user || args.password !== 'secret') {
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
    context: async ({req,res}) => {
        const auth = req ? req.headers.authorization : null
        if(auth && auth.startsWith('Bearer ')){
            const decodedToken = jsonwebtoken.verify(auth.substring(7), process.env.JWT_SECRET)
            const currentUser = await User.findById(decodedToken.id).populate('friends')
            return {currentUser}
        }
    }
}).then(({ url }) => {
    console.log(`Server ready at ${url}`)
})