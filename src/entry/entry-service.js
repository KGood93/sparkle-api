const entryService = {
    getAllEntry(knex) {
        return knex
            .select('*')
            .from('sparkle_entry')
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
    getById(knex, entryid) {
        return knex
            .from('sparkle_entry')
            .select('*')
            .where('entryid', entryid)
            .first()
    },
    deleteEntry(knex, entryid) {
        return knex
            .from('sparkle_entry')
            .where('entryid', entryid)
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