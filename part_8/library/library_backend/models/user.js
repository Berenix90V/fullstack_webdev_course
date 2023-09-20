import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const schema = new mongoose.Schema({
    username: {
        type:String,
        required: true
    },
    favoriteGenre: {
        type: String,
        required: true
    }
})

schema.plugin(uniqueValidator)

schema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = document._id.toString()
        delete returnedObject._id
    }
})

const User = mongoose.model('User', schema)

export default User