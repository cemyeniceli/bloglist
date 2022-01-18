const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', {username:1, name:1})
	response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
	const blog = await Blog.findById(request.params.id)
	if (blog) {
		response.json(blog)
	} else {
		response.status(404).end()
	}
})

blogsRouter.delete('/:id', async (request, response) => {
	const result = await Blog.findByIdAndRemove(request.params.id)
	if (result) {
		response.status(204).end()
	} else {
		response.status(404).send({error: 'Blog does not exists'})
	}
})

blogsRouter.put('/:id', async (request, response) => {
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

blogsRouter.post('/', async (request, response) => {
	const body = request.body

	const user = await User.findById(body.userId)

	const newBlog = new Blog({
		...body,
		user: user._id
	})
	const savedBlog = await newBlog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()
	response.json(savedBlog)
})

module.exports = blogsRouter
