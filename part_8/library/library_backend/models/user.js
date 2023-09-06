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

const User = mongoose.model('User', schema)
export default User