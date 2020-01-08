const entryService = {
    getAllEntry(knex) {
        return knex.select('*').from('sparkle_entry')
    },
    insertEntry(knex, newEntry) {
        return knex
            .inser(newEntry)
            .into('sparkle_entry')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, entryId) {
        return knex
            .from('sparkle_entry')
            .select('*')
            .where('entryId', entryId)
            .first()
    },
    deleteEntry(knex, entryId) {
        return knex
            .from('sparkle_entry')
            .where({entryId})
            .delete()
    },
    updateEntry(knex, entryId, newEntryFields) {
        return knex
            .from('sparkle_entry')
            .where({entryId})
            .update(newEntryFields)
    }
}

module.exports = entryService