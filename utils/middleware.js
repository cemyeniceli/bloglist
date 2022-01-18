const morgan = require('morgan')
const logger  =require('./logger')

morgan.token('dataSent', (req) => {
	if (req.method === 'POST') {
		return JSON.stringify(req.body)    
	}
	return null
})

const morganLogger = morgan(':method :url :status :res[content-length] - :response-time ms :dataSent')

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
	logger.error(error.message)
  
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}
	next(error)
}

module.exports = {
	morganLogger, 
	unknownEndpoint, 
	errorHandler
}