import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    passwordhash: String,
    notes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
    }]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const User = mongoose.model('User', userSchema)

export default User
