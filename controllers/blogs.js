const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response, next) => {
	Blog.find({})
		.then(blogs => {
			response.json(blogs)
		})
		.catch(error => next(error))
})

app.get('/:id', (request, response, next) => {
	const id =request.params.id
	Blog.findById(id)
		.then(blog => blog ? response.json(blog) : response.status(404).end())
		.catch(error => next(error))
})

app.delete('/:id', (request, response, next) => {
	const id = request.params.id
	Blog.findByIdAndRemove(id)
		.then(result => {
			result ? response.status(204).end() : response.status(404).send({error: 'Blog does not exists'})
		})
		.catch(error => next(error))
})

app.get('/info', (request, response, next) => {
	Blog.find({})
		.then(blogs => {
			const numberOfRecords = blogs.length
			const date = new Date()
			response.send(`<p>Blog list has info for ${numberOfRecords} blogs</p><p>${date}</>`)
		})
		.catch(error => {next(error)
		}) 
})

app.put('/:id', (request, response, next) => {
	const body = request.body

	const blog = {
	    title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
	}
    
	Blog.findByIdAndUpdate(request.params.id,
		blog, 
		{ new: true })
		.then(updatedPerson => {
			response.json(updatedPerson)
		})
		.catch(error => next(error))
})

app.post('/', (request, response, next) => {
	const blog = request.body

	const newPerson = new Blog(blog)

	newPerson.save()
		.then(result => {
			response.json(result)
		})
		.catch(error => next(error))  
})

module.exports = blogsRouter
