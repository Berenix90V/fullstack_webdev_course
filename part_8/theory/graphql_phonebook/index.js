import {ApolloServer} from "@apollo/server";
import mongoose from "mongoose";
import config from "./utils/config.js";
import express from 'express'
import User from "./models/user.js";
import typeDefs from "./schema.js";
import resolvers from "./resolvers.js";
import * as http from "http";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import {makeExecutableSchema} from "@graphql-tools/schema";
import {expressMiddleware} from "@apollo/server/express4";
import jwt from "jsonwebtoken";
import cors from 'cors'
import {WebSocketServer} from "ws";
import {useServer} from "graphql-ws/lib/use/ws";

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

    // This `app` is the returned value from `express()`.
    const httpServer = http.createServer(app)

    // Creating the WebSocket server
    const wsServer = new WebSocketServer({
        // This is the `httpServer` we created in a previous step.
        server: httpServer,
        // Pass a different path here if app.use
        // serves expressMiddleware at a different path
        path: '/'
    })

    // Create an instance of GraphQLSchema
    const schema = makeExecutableSchema({typeDefs, resolvers})

    // Hand in the schema we just created and have the
    // WebSocketServer start listening.
    const serverCleanup = useServer({schema}, wsServer)

    const server = new ApolloServer({
        schema,
        plugins: [
            // Proper shutdown for the HTTP server.
            ApolloServerPluginDrainHttpServer({ httpServer }),

            // Proper shutdown for the WebSocket server.
            {
                async serverWillStart(){
                    return{
                        async drainServer(){
                            await serverCleanup.dispose()
                        }
                    }
                }
            }],
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