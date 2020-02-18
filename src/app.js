require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const {NODE_ENV, CLIENT_ORIGIN} = require('./config')
const entryRouter = require('./entry/entry-router')
const journalRouter = require('./journal/journal-router')
const quoteRouter = require('./quotes/quote-router')
//const authRouter = require('./auth/auth-router')
//const usersRouter = require('./users/users-router')

const app = express()

//const morganOption = 'common'

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

//app.use(
//    cors({
//        origin: CLIENT_ORIGIN
//    })
//);

//const whiteList = ['https://sparkle-app.now.sh', 'https://sparkle-app-1bojitddx.now.sh', 'https://sparkle-app.goodreaukath.now.sh']

//const corsOptions = {
//    origin: function(origin, callback) {
//        if(whiteList.indexOf(origin) !== -1) {
//            callback(null,true)
//        }
//        else {
//            callback(new Error('Not allowed by CORS'))
//        }
//    }
//}

//if(NODE_ENV === 'production') {
//    app.use(cors(corsOptions))
//}
//else {
//    app.use(cors())
//}



app.use('/entry', entryRouter)
app.use('/journal', journalRouter)
app.use('/quote', quoteRouter)
//app.use('/auth', authRouter)
//app.use('/users', usersRouter)

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if(NODE_ENV === 'production') {
        response = {error: {message: 'server error'}}
    }
    else{
        console.error(error)
        response = {message: error.message, error}
    }
    res.status(500).json(response)
})

module.exports = app