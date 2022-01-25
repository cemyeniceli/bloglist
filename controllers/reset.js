const testRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

testRouter.post('/reset', async (request, response) => {
    await Note.deleteMany({})
    await User.deleteMany({})
    response.status(204).end()
})
  
  module.exports = testRouter