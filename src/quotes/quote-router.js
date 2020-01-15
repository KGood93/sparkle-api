const path = require('path')
const express = require('express')
const xss = require('xss')
const jsonParser = express.json()
const quoteService = require('./quote-service')
const quoteRouter = express.Router()

quoteRouter
.route("/")
.get((req, res, next) => {
    quoteService.getAllQuotes(req.app.get('db'))
        .then(quote => {
            res.json(quote)
        })
        .catch(next)
})

module.exports = quoteRouter