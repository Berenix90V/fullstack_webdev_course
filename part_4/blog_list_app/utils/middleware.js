
const errorHandler = (error, request, response, next) => {
    if(error.name === 'ValidationError'){
        response.status(400).json({error: "title or url missing"})
    }
    next(error)
}

const middleware = {
    errorHandler
}

export default middleware
