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