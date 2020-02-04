const journalService = require('../src/journal/journal-service')
const knex = require('knex')

describe(`Journal service object`, function() {
    let db
    let testJournals = [
        {
            journalid: 1,
            userid: 'Hello',
        },
        {
            journalid: 2,
            userid: 'Test',
        },
        {
            journalid: 3,
            userid: 'Journal',
        },
        {
            journalid: 4,
            userid: 'Please',
        },
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('sparkle_journal').truncate())

    afterEach(() => db('sparkle_journal').truncate())

    after(() => db.destroy())

    //describe(`getAllJournals()`, () => {
    context(`Given 'sparkle_journal' has data`, () => {
        beforeEach(() => {
            return db
                .into('sparkle_journal')
                .insert(testJournals)
        })

        it(`getAllJournals() resolves all journals from 'sparkle_journal' table`, () => {
            //test that JournalService.getAllJournals gets data from table
            return journalService.getAllJournals(db)
                .then(actual => {
                    expect(actual).to.eql(testJournals)
                })
        })

        it(`getById() resolves a journal by id from 'sparkle_journal' table`, () => {
            const thirdId = 3
            const thirdTestJournal = testJournals[thirdId - 1]
            return journalService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        journalid: thirdId,
                        userid: thirdTestJournal.userid
                    })
                })
        })
    })

    context(`Given 'sparkle_journal' has no data`, () => {
        it(`getAllJournals() resolves an empty array`, () => {
            return journalService.getAllJournals(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })
    })
})