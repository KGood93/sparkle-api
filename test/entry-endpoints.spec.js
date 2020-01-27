const entryService = require('../src/entry/entry-service')
const knex = require('knex')

describe(`Entry service object`, function() {
    let db
    let testEntries = [
        {
            entryid: 1,
            title: 'Test Entry 1',
            date: new Date('2029-01-22T16:28:32.615Z'),
            content: 'Test Content 1',
            journalid: 1, 
            quoteid: 1
        },
        {
            entryid: 2,
            title: 'Test Entry 2',
            date: new Date('2029-01-22T16:28:32.615Z'),
            content: 'Test Content 2',
            journalid: 1, 
            quoteid: 2
        },
        {
            entryid: 3,
            title: 'Test Entry 3',
            date: new Date('2029-01-22T16:28:32.615Z'),
            content: 'Test Content 3',
            journalid: 1, 
            quoteid: 3
        },
        {
            entryid: 4,
            title: 'Test Entry 4',
            date: new Date('2029-01-22T16:28:32.615Z'),
            content: 'Test Content 4',
            journalid: 1, 
            quoteid: 4
        },
    ]
    
    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('sparkle_entry').truncate())

    afterEach(() => db('sparkle_entry').truncate())

    after(() => db.destroy())

    //describe(`getAllEntry()`, () => {
    context(`Given 'sparkle_entry' has data`, () => {
        beforeEach(() => {
            return db
                .into('sparkle_entry')
                .insert(testEntries)
        })

        it(`getAllEntry() resolves all entries from 'sparkle_entry' table`, () => {
            //test that entryService.getAllEntry() gets data from table
            return entryService.getAllEntry(db)
                .then(actual => {
                    expect(actual).to.eql(testEntries)
                })
        })

        it(`getById() resolves an entry by id from 'sparkle_entry' table`, () => {
            const thirdId = 3
            const thirdTestEntry = testEntries[thirdId - 1]
            return entryService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        entryid: thirdId,
                        title: thirdTestEntry.title,
                        date: thirdTestEntry.date,
                        content: thirdTestEntry.content,
                        journalid: thirdTestEntry.journalid, 
                        quoteid: thirdTestEntry.quoteid
                    })
                })
        })

        it(`deleteEntry() removes an entry by id from 'sparkle_entry' table`, () => {
            const entryId = 3
            return entryService.deleteEntry(db, entryId)
                .then(() => entryService.getAllEntry(db))
                .then(allEntry => {
                    [
                        {
                            entryid: 1,
                            title: 'Test Entry 1',
                            date: new Date('2029-01-22T16:28:32.615Z'),
                            content: 'Test Content 1',
                            journalid: 1, 
                            quoteid: 1
                        },
                        {
                            entryid: 2,
                            title: 'Test Entry 2',
                            date: new Date('2029-01-22T16:28:32.615Z'),
                            content: 'Test Content 2',
                            journalid: 1, 
                            quoteid: 2
                        },
                        {
                            entryid: 4,
                            title: 'Test Entry 4',
                            date: new Date('2029-01-22T16:28:32.615Z'),
                            content: 'Test Content 4',
                            journalid: 1, 
                            quoteid: 4
                        },
                    ]
                    const expected = testEntries.filter(entry => entry.entryid !== entryId)
                    expect(allEntry).to.eql(expected)
                })
        })

        it(`updateEntry() updates an entry from the 'sparkle_entry' table`, () => {
            const idOfEntryToUpdate = 3
            const newEntryData = {
                title: 'update title',
                content: 'update content', 
                date: new Date()
            }
            return entryService.updateEntry(db, idOfEntryToUpdate, newEntryData)
                .then(() => entryService.getById(db, idOfEntryToUpdate))
                .then(entry => {
                    expect(entry).to.eql({
                        entryid: idOfEntryToUpdate,
                        title: newEntryData.title,
                        content: newEntryData.content,
                        date: newEntryData.date,
                        journalid: 1,
                        quoteid: 3
                    })
                })
        })
    })

    context(`Given 'sparkle_entry' has no data`, () => {
        it(`getAllEntry() resolves an empty array`, () => {
            return entryService.getAllEntry(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })

        it(`insertEntry() inserts a new entry and resolves the new entry with and 'id'`, () => {
            const newEntry = {
                title: 'Test Entry New',
                date: new Date('2029-01-22T16:28:32.615Z'),
                content: 'Test Content New',
                journalid: 1, 
                quoteid: 1
            }
            return entryService.insertEntry(db, newEntry)
                .then(actual => {
                    expect(actual).to.eql({
                        entryid: 1,
                        title: newEntry.title,
                        date: new Date (newEntry.date),
                        content: newEntry.content,
                        journalid: newEntry.journalid,
                        quoteid: newEntry.quoteid
                    })
                })
        })
    })
})