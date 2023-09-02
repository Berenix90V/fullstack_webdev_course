import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {v1 as uuid} from 'uuid'
import {GraphQLError} from 'graphql'
import mongoose from "mongoose";
import config from "./utils/config.js";
import Person from "./models/person.js"

mongoose.set('strictQuery', false)

mongoose.connect(config.mongodb_url)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })


const typeDefs = `
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
  }
`

const resolvers = {
    Query: {
        personCount: async() => Person.collection.countDocuments(),
        allPersons: (root, args) => {
            if(!args.phone){
                return Person.find({})
            }
            return Person.find({phone: {$exists: args.phone === 'YES'}})
        },
        findPerson: async (root, args) =>
            Person.find({ name: args.name})
    },
    Person: {
        address: (root) => {
            return {
                street: root.street,
                city: root.city,
            }
        },
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