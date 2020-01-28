const quotesService = require('../src/quotes/quote-service')
const knex = require('knex')

describe(`Quotes service object`, function() {
    let db
    let testQuotes = [
        {
            quoteid: 1,
            quote: 'It is nap time',
            author: 'Buster'
        },
        {
            quoteid: 2,
            quote: 'Feed Me',
            author: 'Dexter'
        },        
        {
            quoteid: 3,
            quote: 'Squirrel!',
            author: 'Henry'
        }
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    before(() => db('sparkle_quotes').truncate())

    afterEach(() => db('sparkle_quotes').truncate())

    after(() => db.destroy())

    context(`Given 'sparkle_quotes' has data`, () => {
        beforeEach(() => {
            return db
                .into('sparkle_quotes')
                .insert(testQuotes)
        })
    
        it(`qetAllQuotes() resolves all articles from 'sparkle_quotes' table`, () => {
            return quotesService.getAllQuotes(db)
                .then(actual => {
                    expect(actual).to.eql(testQuotes)
                })
        })

        it(`getById() resolves a quote by id from 'sparkle_quotes' table`, () => {
            const thirdId = 3
            const thirdQuote = testQuotes[thirdId - 1]
            return quotesService.getById(db, thirdId)
                .then(actual => {
                    expect(actual).to.eql({
                        quoteid: thirdId,
                        quote: thirdQuote.quote,
                        author: thirdQuote.author
                    })
                })
        })
    })

    context(`Given 'sparkle_quotes' has no data`, () => {
        it(`getAllQuotes() resolves an empty array`, () => {
            return quotesService.getAllQuotes(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })
    })
})