import jsonwebtoken from 'jsonwebtoken'
import express from 'express'
import User from '../models/user.js'
import bcrypt from "bcrypt";

const loginRouter = express.Router()

loginRouter.post('/', async (request, response) => {
    const {username, password} = request.body
    const user = await User.findOne({username})

    const passwordIsCorrect = user===null? false : await bcrypt.compare(password, user.passwordHash)
    if(!(user && passwordIsCorrect)){
        response.status(401).json({error: 'Invalid username or password'})
    }

    const userForToken = {
        username: user.username,
        id: user.id
    }
    const token = jsonwebtoken.sign(userForToken, process.env.SECRET)
    response.status(200).send({token, username: user.username, name: user.name, id: user.id})
})

export default loginRouter