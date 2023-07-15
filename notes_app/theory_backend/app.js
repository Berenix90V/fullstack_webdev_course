import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import notesRouter from "./controllers/notes.js";
import mongoose from "mongoose";
import config from './utils/config'

const app = express()

mongoose.set('strictQuery', false)

console.log('connecting to', config.MONGODB_URL)

mongoose.connect(config.MONGODB_URL)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log('Error connecting to Mongo', error.message)
    })


// def functions for middleware
const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        response.status(400).json({ error: error.message })
    }
    next(error)
}

const requestLogger = (request, response, next) => {
    console.log('Method: ', request.method)
    console.log('Path: ', request.path)
    console.log('Body: ', request.body)
    console.log('---')
    next()
}

const unknownEndPoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// Middleware
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)

app.use('/api/notes', notesRouter)
app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.use(unknownEndPoint)
app.use(errorHandler)

export default app
