require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
? process.env.TEST_MONGODB_URI
: process.env.MONGODB_URI
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD
const MONGODB_CONNECT = MONGODB_URI.replace('<password>', MONGODB_PASSWORD)
const SECRET = process.env.SECRET

module.exports = {
    MONGODB_URI,
    MONGODB_CONNECT,
    PORT,
    SECRET
}