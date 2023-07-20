import bcrypt from 'bcrypt'
import express from 'express'
import User from '../models/user.js'

const usersRouter = express.Router()

usersRouter.post('/', async (request, response) => {
    const body = request.body

    const password = body.password
    if(!password || password.length<3){
        response.status(400).send({error: 'invalid password'})
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const newUser = new User({
        username: body.username,
        name: body.name,
        passwordHash: passwordHash
    })
    const savedUser = await newUser.save()
    response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.status(200).json(users)
})

export default usersRouter
