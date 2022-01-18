const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

describe('when there is initially some blogs saved', () => {
    test('notes are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    }, 100000)
    
    test('the number of blogs is correct', async () => {
        const response = await api.get('/api/blogs')
      
        expect(response.body).toHaveLength(helper.initialBlogs.length)
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

    test('unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs')
        
        expect(response.body[0].id).toBeDefined()
    })
})

describe('addition of a new blog', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: "React rocks",
            author: "Michael Cem",
            url: "https://reactpatterns.com/",
            likes: 1
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const titles = blogsAtEnd.map(r => r.title)

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
        expect(titles).toContain('React rocks')
    },100000)

    test('a blog without author is not added', async () => {
        const newBlog = {
            title: "React rocks",
            url: "https://reactpatterns.com/",
            likes: 1
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    },100000)

    test('a blog without title is not added', async () => {
        const newBlog = {
            author: "React Rects",
            url: "https://reactpatterns.com/",
            likes: 1
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    },100000)

    test('a blog without url is not added', async () => {
        const newBlog = {
            title: "React rocks",
            author: "https://reactpatterns.com/",
            likes: 1
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    },100000)

    test('a blog without likes defined will default to zero like and added', async () => {
        const newBlog = {
            title: "React rocks",
            url: "https://reactpatterns.com/",
            author: 'Cem Yenicelidd'
        }
        const resultBlog = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
        expect(resultBlog.body.likes).toBe(0)
    },100000)
})

describe('viewing a specific blog', () => {
    test('a specific blog can be viewed', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]

        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const processedBlogtoView = JSON.parse(JSON.stringify(blogToView))

        expect(resultBlog.body).toEqual(processedBlogtoView)
    })

    test('fails with statuscode 404 if blog does not exist ', async () => {
        const validNonExistingId = await helper.nonExistingId()

        await api
            .get(`/api/blogs/${validNonExistingId}`)
            .expect(404)
    })

    test('fails with statuscode 400 if id is invalid ', async () => {
        const invalidId = '5a3d5da59070081a82a3445'

        await api
            .get(`/api/blogs/${invalidId}`)
            .expect(400)
    })
})

describe('deleting a blog', () => {
    test('success with 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
        
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

        const titles = blogsAtEnd.map(r => r.title)
        expect(titles).not.toContain(blogToDelete.title)
    })

    test('fails with 404 if id does not exists', async () => {
        const nonExistingId = await helper.nonExistingId()

        await api
            .delete(`/api/blogs/${nonExistingId}`)
            .expect(404)
    })

    test('fails with 400 if id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445'

        await api
            .delete(`/api/blogs/${invalidId}`)
            .expect(400)
    })
})

describe('updating a specific blog', () => {
    test('a specific blog is updated with all properties', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        
        const blogUpdate = {
            title: 'Cem Yenice',
            author: 'Cem Yeniceli',
            url: 'Cem_Yeniceli.html',
            likes: 11546,
        }

        const updatedBlog = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogUpdate)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const updatedBlogAtEnd = blogsAtEnd[0]

        expect(updatedBlog.body).toEqual(updatedBlogAtEnd)
        expect(blogUpdate.title).toBe(updatedBlogAtEnd.title)
        expect(blogUpdate.likes).toBe(updatedBlog.body.likes)
    })

    test('a specific blog is updated with only likes', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        
        const blogUpdate = {
            likes: 11546
        }

        const updatedBlog = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(blogUpdate)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        const updatedBlogAtEnd = blogsAtEnd[0]

        expect(updatedBlog.body).toEqual(updatedBlogAtEnd)
        expect(blogUpdate.likes).toBe(updatedBlog.body.likes)
    })
})

afterAll(() => {
        mongoose.connection.close()
})


