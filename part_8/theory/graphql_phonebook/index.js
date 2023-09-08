import {ApolloServer} from "@apollo/server";
import mongoose from "mongoose";
import config from "./utils/config.js";
import express from 'express'
import User from "./models/user.js";
import typeDefs from "./schema.js";
import resolvers from "./resolvers.js";
import * as http from "http";
import {ApolloServerPluginDrainHttpServer} from "@apollo/server/src/plugin/drainHttpServer/index.js";
import {makeExecutableSchema} from "@graphql-tools/schema";
import {expressMiddleware} from "@apollo/server/express4";
import jwt from "jsonwebtoken";
import cors from 'cors'

mongoose.set('strictQuery', false)

mongoose.connect(config.mongodb_url)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })


const start = async () => {
    const app = express()
    const httpServer = http.createServer(app)
    const server = new ApolloServer({
        schema: makeExecutableSchema({typeDefs, resolvers}),
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    })
    await server.start()

    app.use(
        '/',
        cors(),
        express.json(),
        expressMiddleware(server, {
            context: async({req})=> {
                const auth = req? req.headers.authorization : null
                if(auth && auth.startsWith('Bearer ')){
                    const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
                    const currentUser = await User.findById(decodedToken.id).populate(
                        'friends'
                    )
                    return { currentUser }
                }
            }
        })
    )
    const PORT = 4000

    httpServer.listen(PORT, () =>
        console.log(`Server is now running on http://localhost:${PORT}`)
    )
}

start()