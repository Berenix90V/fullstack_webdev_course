
const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        response.status(400).send({error: 'malformatted id'})
    } else if(error.name === 'ValidationError'){
        response.status(400).json({error: error.message})
    }
    next(error)
}

const middleware = {
    errorHandler
}

export default middleware
