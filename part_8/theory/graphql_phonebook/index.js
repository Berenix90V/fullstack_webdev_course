import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {GraphQLError} from 'graphql'
import mongoose from "mongoose";
import config from "./utils/config.js";
import Person from "./models/person.js"
import User from "./models/user.js";
import jsonwebtoken from 'jsonwebtoken'
import typeDefs from "./schema.js";
import resolvers from "./resolvers.js";

mongoose.set('strictQuery', false)

mongoose.connect(config.mongodb_url)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })


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