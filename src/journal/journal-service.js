const journalService = {
    getAllJournals(knex) {
        return knex
            .select('*')
            .from('sparkle_journal')
    },
    getById(knex, journalid) {
        return knex
            .from('sparkle_journal')
            .select('*')
            .where('journalid', journalid)
            .first()
    }
}

module.exports = journalService