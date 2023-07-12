import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Note from "./models/note.js";

const app = express()

// Middleware
app.use(cors())
app.use(express.static('build'))



const requestLogger = (request, response, next)=>{
    console.log('Method: ', request.method)
    console.log('Path: ', request.path)
    console.log('Body: ', request.body)
    console.log('---')
    next()
}

app.use(express.json())
app.use(requestLogger)

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]


app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes=>{
        response.json(notes)
    })

})

app.get('/api/notes/:id', (request, response) => {
    const noteID = request.params.id
    Note.findById(noteID)
        .then(note=>{
            if(note){
                response.json(note)
            } else{
                response.status(404).end()
            }
        })
        .catch(error =>{
            console.log(error)
            response.status(400).send({error: 'malformatted id'})
        })
})

app.delete('/api/notes/:id', (request, response)=>{
    const id = Number(request.params.id)
    notes = notes.filter(n=>n.id!==id)
    response.status(204).end()
})

const generateID = () =>{
    const maxID = notes.length > 0?
        Math.max(...notes.map(n=>n.id))
        : 0
    return maxID+1
}
app.post('/api/notes/', (request, response) => {
    const body = request.body
    if(body.content === undefined)
        return response.status(400).json({ error: 'content missing'})
    const note = new Note({
        content: body.content,
        important: body.important || false,
    })
    note.save().then(savedNote => {
        response.json(savedNote)
    })
})

const unknownEndPoint = (request, response) => {
    response.status(404).send({error:'unknown endpoint'})
}

app.use(unknownEndPoint)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server listening on the port ${PORT}`)
