const morgan = require('morgan')
const logger = require('./logger')
const config = require('./config')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

morgan.token('dataSent', (req) => {
	if (req.method === 'POST') {
		return JSON.stringify(req.body)    
	}
	return null
})

const morganLogger = morgan(':method :url :status :res[content-length] - :response-time ms :dataSent')

const unknownEndpoint = (request, response, next) => {
	response.status(404).send({ error: 'unknown endpoint' })
	next()
}

const errorHandler = (error, request, response, next) => {
	logger.error(error.message)
  
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	} else if (error.name === 'JsonWebTokenError') {
		return response.status(401).json({ error: 'invalid token' })
	} else if (error.name === 'TokenExpiredError') {
		return response.status(401).json({ error: 'token expired' })
	}
	next(error)
}

const userExtractor = async (request, response, next) => {
	const auth = request.get('authorization')
	if (auth && auth.toLowerCase().startsWith('bearer ')) {
		const token = auth.substring(7)
		const decodedToken = jwt.verify(token, config.SECRET)
		if (!decodedToken.id) {
			return response.status(401).json({error: 'token missing or invalid'})
		}
		const user = await User.findById(decodedToken.id)
		request.user = user
	}
	next()
}

module.exports = {
	morganLogger, 
	unknownEndpoint, 
	errorHandler,
	userExtractor
}