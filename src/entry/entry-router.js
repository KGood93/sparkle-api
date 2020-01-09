const path = require('path')
const express = require('express')
const xss = require('xss')
const jsonParser = express.json()
const entryService = require('./entry-service')
const entryRouter = express.Router()

const serializeEntry = entry => ({
    entryId : entry.entryId,
    name: xss(entry.name),
    content: xss(entry.content),
    journalId: entry.journalId
});

entryRouter
    .route("/")
    .get((req, res, next) => {
        entryService.getAllEntry(req.app.get('db'))
            .then(entry => {
                res.json(entry)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {name, journalId, content} = req.body
        const newEntry = {name, journalId, content}

        for(const [key, value] of Object.entries(newEntry))
            if(value == null)
                return res.status(400).json({
                    error: {message: `Missing '${key}' in request body`}
                })
        
        entryService.insertEntry(req.app.get('db'), newEntry)
            .then(entry => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl), `/${entry.entryId}`)
                    .json(serializeEntry(entry))
            })
            .catch(next)
    })

module.exports = entryRouter