const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const blogSchema = new mongoose.Schema({
    title: {
		type: String,
		minlength: 3,
		required: true
	},
    author: {
		type: String,
		minlength: 3,
		unique: true,
		uniqueCaseInsensitive: true,
		required: true
	},
    url: {
		type: String,
		minlength: 5,
		unique: true,
		required: true
	},
    likes: {
		type: Number,
		required: true
	}
})

blogSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})
blogSchema.plugin(uniqueValidator)

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog