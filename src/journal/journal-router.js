const path = require('path')
const express = require('express')
const xss = require('xss')
const journalService = require('./journal-service')
const {requireAuth} = require('../middleware/jwt-auth')

const journalRouter = express.Router()
//const jsonParser = express.json()

const serializeJournal = journal => ({
    journalId : journal.journalid
})

journalRouter
    .route('/:journalId')
    .all((req, res, next) => {
        journalService.getById(req.app.get('db'), req.params.journalId)
        .then(journal => {
            if (!journal) {
                return res.status(404).json({
                    error: {message: `Journal doesn't exist`}
                })
            }
            console.log(res.journal)
            res.journal = journal
            next()
        })
        .catch(next)
    })
    .get((req, res, next) => {
        console.log(res.journal)
        res.json(serializeJournal(res.journal))
    })

module.exports = journalRouter