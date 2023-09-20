import mongoose from "mongoose";
import {ApolloServer} from "@apollo/server";
import config from "./utils/config.js"
import User from "./models/user.js";
import express from 'express'
import cors from 'cors'
import * as http from "http";
import jsonwebtoken from 'jsonwebtoken'
import {makeExecutableSchema} from "@graphql-tools/schema";
import {ApolloServerPluginDrainHttpServer} from "@apollo/server/plugin/drainHttpServer";
import {expressMiddleware} from "@apollo/server/express4";
import {WebSocketServer} from "ws";
import {useServer} from "graphql-ws/lib/use/ws";
import typeDefs from "./schema.js";
import resolvers from "./resolvers.js";

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

const start = async () => {
    const app =  express()
    const httpServer = http.createServer(app)

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/'
    })

    const schema = makeExecutableSchema({typeDefs, resolvers})
    const serverCleanup = useServer({schema}, wsServer)

    const server =  new ApolloServer({
        schema,
        plugins: [ApolloServerPluginDrainHttpServer({httpServer}), {
            async serverWillStart() {
                return {
                    async drainServer () {
                        await serverCleanup.dispose();
                    }
                }
            }
        }]
    })

    await server.start()

    app.use(
        '/',
        cors(),
        express.json(),
        expressMiddleware( server, {
            context: async ({req, res}) => {
                const auth = req? req.headers.authorization : null
                if (auth && auth.startsWith('Bearer ')){
                    const decodedToken = jsonwebtoken.verify(auth.substring(7), process.env.JWT_SECRET)
                    const currentUser = await User.findById(decodedToken.id)
                    return {currentUser}
                }
            }
        })
    )

    const PORT = 4000
    httpServer.listen(PORT, () => console.log(`Server is now running on http://localhost:${PORT}`))

}

start()
