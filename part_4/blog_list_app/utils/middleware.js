
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

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('Authorization')
    if(authorization && authorization.startsWith('Bearer ')) {
        const token = authorization.replace('Bearer ', '')
        request.token = token
    }
    next()
}

const middleware = {
    errorHandler,
    tokenExtractor
}

export default middleware
