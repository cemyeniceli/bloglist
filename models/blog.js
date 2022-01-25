const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const blogSchema = new mongoose.Schema({
	title: {
		type: String,
		minlength: 3,
		unique: true,
		required: true
	},
	author: {
		type: String,
		minlength: 3,
		required: true
	},
	url: {
		type: String,
		minlength: 5,
		required: true
	},
	likes: {
		type: Number,
		default: 0
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
})

blogSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		returnedObject.user = returnedObject.user.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})
blogSchema.plugin(uniqueValidator)

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog