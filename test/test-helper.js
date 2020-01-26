const bcrypt = require('bcryptjs')

function makeUsersArray() {
  return [
    {
      userid: 1,
      username: 'test-user-1',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z')
    },
    {
      userid: 2,
      username: 'test-user-2',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z')
    },
    {
      userid: 3,
      username: 'test-user-3',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z')
    },
    {
      userid: 4,
      username: 'test-user-4',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z')
    }
  ]
}

function makeArticlesFixtures() {
  const testUsers = makeUsersArray()
  //const testArticles = makeArticlesArray(testUsers)
  //const testComments = makeCommentsArray(testUsers, testArticles)
  return { testUsers }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        sparkle_users
      `
    )
    .then(() =>
      Promise.all([
        //trx.raw(`ALTER SEQUENCE blogful_articles_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE sparkle_usersid_seq minvalue 0 START WITH 1`),
        //trx.raw(`ALTER SEQUENCE blogful_comments_id_seq minvalue 0 START WITH 1`),
        //trx.raw(`SELECT setval('blogful_articles_id_seq', 0)`),
        trx.raw(`SELECT setval('sparkle_usersid_seq', 0)`),
        //trx.raw(`SELECT setval('blogful_comments_id_seq', 0)`),
      ])
    )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password : bcrypt.hashSync(user.password, 1)
  }))
  return db.into('sparkle_users').insert(preppedUsers)
    .then(() => 
      //update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('sparkle_usersid_seq', ?)`,
        [users[users.length -1].id],
      )
    )
}

function makeAuthHeader(user) {
  const token = Buffer.from(`${user.user_name}:${user.password}`)
  return `Basic ${token}`
}

module.exports = {
  makeUsersArray,

  makeArticlesFixtures,
  cleanTables,
  makeAuthHeader,
  seedUsers,
}