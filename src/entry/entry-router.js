const path = require('path')
const express = require('express')
const xss = require('xss')
const jsonParser = express.json()
const entryService = require('./entry-service')
const entryRouter = express.Router()
const {requireAuth} = require('../middleware/jwt-auth')

const serializeEntry = entry => ({
    entryId : entry.entryid,
    title: xss(entry.title),
    content: xss(entry.content),
    quoteId : entry.quoteid,
    journalId: entry.journalid
});

entryRouter
    .route("/")
    .all(requireAuth)
    .get((req, res, next) => {
        entryService.getAllEntry(req.app.get('db'))
            .then(entry => {
                res.json(entry)
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {title, journalid, content, quoteid} = req.body
        const newEntry = {title, journalid, content, quoteid}

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

entryRouter
    .route("/:entryId")
    .all(requireAuth)
    .all((req, res, next) => {
        entryService.getById(req.app.get('db'), req.params.entryId)
            .then(entry => {
                if (!entry) {
                    return res.status(404).json({
                        error: {message: `Entry doesn't exist`}
                    })
                }
                res.entry = entry
                    next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        //console.log(res.entry)
        res.json(serializeEntry(res.entry))
    })
    .delete((req, res, next) => {
        entryService.deleteEntry(req.app.get('db'), req.params.entryId)
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const {content} = req.body
        const entryToUpdate = {content}

        const numberofValues = Object.values(entryToUpdate).filter(Boolean).length

        if(numberofValues === 0)
            return res.status(400).json({
                error: {message: `Request body is missing required fields`}
            })

        entryService.updateEntry(
            req.app.get('db'),
            req.params.entryId,
            entryToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = entryRouter