const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

const api = supertest(app)

describe('when there is initially one user in db', () => {
	beforeEach(async () => {
		await User.deleteMany({})
		const passwordHash = await bcrypt.hash('sekret', 10)
		const user = new User({ username: 'root', passwordHash })

		await user.save()
	})

	test('users are returned as json', async () => {
		await api
			.get('/api/users')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	},100000)

	test('there is only one user which is root', async () => {
		const result = await api
			.get('/api/users')
			.expect(200)
			.expect('Content-Type', /application\/json/)

		expect(result.body.length).toBe(1)
		expect(result.body[0].username).toBe('root')
	},100000)



	test('creation succeeds with a fresh username', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'cemyeniceli',
			name: 'Cem Yeniceli',
			password: 'madrex' 
		}

		await api
			.post('/api/users')
			.send(newUser)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
		const usernames = usersAtEnd.map(u => u.username)
		expect(usernames).toContain(newUser.username)
	})

	test('creation fails with proper statuscode and message if username already taken', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'root',
			name: 'Cem Yeniceli',
			password: 'madrex' 
		}

		await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length)
	})
	test('creation fails with proper statuscode and message if password is less than 3 characters', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'root2',
			name: 'Cem Yeniceli',
			password: 'ro' 
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length)
		const errorMessage = result.body.error
		expect(errorMessage).toBe('password length should be at 3 characters long')
	})
	test('creation fails with proper statuscode and message if username is less than 3 characters', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'as',
			name: 'Cem Yeniceli',
			password: 'rodsd' 
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length)
		const errorMessage = result.body.error
		expect(errorMessage).toContain('User validation')
	})
	test('user can login with correct password', async () => {
		const result = await api
			.post('/api/login')
			.send({username: 'root', password:'sekret'})
			.expect(200)
			.expect('Content-Type', /application\/json/)
		expect(result.body.token).toBeDefined()
	})
	test('login fails with 401 with wrong password', async () => {
		const result = await api
			.post('/api/login')
			.send({username: 'root', password:'wrongPass'})
			.expect(401)
			.expect('Content-Type', /application\/json/)
		expect(result.body.error).toContain('invalid username or password')    
	})
	test('login fails with 401 with wrong username', async () => {
		const result = await api
			.post('/api/login')
			.send({username: 'wrongUser', password:'sekret'})
			.expect(401)
			.expect('Content-Type', /application\/json/)
		expect(result.body.error).toContain('invalid username or password')    
	})   
})


afterAll(() => {
	mongoose.connection.close()
})