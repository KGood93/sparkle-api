const quoteService = {
    getAllQuotes(knex) {
        return knex
            .select('*')
            .from('sparkle_quotes')
    },
    getById(knex, quoteid) {
        return knex
            .from('sparkle_quotes')
            .select('*')
            .where('quoteid', quoteid)
            .first()
    }
}

module.exports = quoteService