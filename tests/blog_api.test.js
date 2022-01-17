const res = require('express/lib/response')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const blogs = [
    {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7
    },
    {
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5
    },
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12
    },
    {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10
    },
    {
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0
    },
    {
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2
    }  
  ]

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(blogs[0])
    await blogObject.save()
    blogObject = new Blog(blogs[1])
    await blogObject.save()
    blogObject = new Blog(blogs[2])
    await blogObject.save()
    blogObject = new Blog(blogs[3])
    await blogObject.save()
    blogObject = new Blog(blogs[4])
    await blogObject.save()
    blogObject = new Blog(blogs[5])
    await blogObject.save()
})

describe('api tests', () => {
    test('notes are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    }, 100000)
    
    test('there is one blog', async () => {
        const response = await api.get('/api/blogs')
      
        expect(response.body).toHaveLength(blogs.length)
    })
      
    test('the first blog is written by Michael', async () => {
        const response = await api.get('/api/blogs')
      
        expect(response.body[0].author).toBe('Michael Chan')
    })

    test('a specific author is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
        
        const authors = response.body.map(r=>r.author)
        expect(authors).toContain('Robert C. Martin')
    })

    afterAll(() => {
        mongoose.connection.close()
    })
}) 


