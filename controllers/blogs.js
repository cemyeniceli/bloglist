const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
	const blogs = await Blog.find({})
	response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
	const blog = await Blog.findById(request.params.id)
	if (blog) {
		response.json(blog)
	} else {
		response.status(404).end()
	}
})

blogsRouter.delete('/:id', async (request, response, next) => {
	const result = await Blog.findByIdAndRemove(request.params.id)
	if (result) {
		response.status(204).end()
	} else {
		response.status(404).send({error: 'Blog does not exists'})
	}
})

blogsRouter.put('/:id', async (request, response, next) => {
	const body = request.body
	const blog = {
	    title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
	}
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new:true})
	response.json(updatedBlog)
})

blogsRouter.post('/', async (request, response, next) => {
	const blog = request.body

	const newPerson = new Blog(blog)
	const result = await newPerson.save()
	response.json(result)
})

module.exports = blogsRouter
