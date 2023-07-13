import mongoose from "mongoose";

mongoose.set('strictQuery', false)

const url = process.env.MONGO_URL
console.log('connecting to', url)

mongoose.connect(url)
    .then(result=>{
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log('Error connecting to Mongo', error.message)
    })

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        minLength: 5,
        required: true
    },
    important: Boolean
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) =>{
        returnedObject.id = document._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Note = mongoose.model('Note', noteSchema)
export default Note