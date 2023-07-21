import jsonwebtoken from "jsonwebtoken";

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        response.status(400).send({error: 'malformatted id'})
    } else if(error.name === 'ValidationError'){
        response.status(400).json({error: error.message})
    } else if (error.name === 'JsonWebTokenError'){
        response.status(400).json({error: error.message})
    }
    next(error)
}

const userExtractor = (request, response, next) => {
    const authorization = request.get('Authorization')
    if(authorization && authorization.startsWith('Bearer ')) {
        const token = authorization.replace('Bearer ', '')
        const decodedToken = jsonwebtoken.decode(token, process.env.SECRET)
        request.user = decodedToken.id.toString()
    }
    next()
}

const middleware = {
    errorHandler,
    userExtractor
}

export default middleware
