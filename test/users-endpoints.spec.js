const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helper')

describe('Users Endpoints', function() {
  let db

  const { testUsers } = helpers.makeArticlesFixtures()
  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`POST /users`, () => {
    context(`User Validation`, () => {
      beforeEach('insert users', () =>
        helpers.seedUsers(
          db,
          testUsers,
        )
      )

      const requiredFields = ['username', 'password']

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          username: 'test username',
          password: 'test password',
        }

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/users')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            })
        })
      })

      it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
        const userShortPassword = {
            username: 'test username', 
            password: '1234567',
        }
        return supertest(app)
            .post('/users')
            .send(userShortPassword)
            .expect(400, {error: `Password must be longer than 8 characters`})
      })

      it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
          const userLongPassword = {
              username: 'test username',
              password: '*'.repeat(73),
          }
          //console.log(userLongPassword)
          //console.log(userLongPassword.password.length)
          return supertest(app)
            .post('/users')
            .send(userLongPassword)
            .expect(400, {error: `Password must be less than 72 characters`})
      })

      it(`responds 400 error when password starts with spaces`, () => {
          const userPasswordStartsSpaces = {
              username: 'test username',
              password: ' 1Aa!2Bb@',
          }
          return supertest(app)
            .post('/users')
            .send(userPasswordStartsSpaces)
            .expect(400, {error: `Password must not start or end with empty spaces`})
      })

      it(`responds 400 error when password ends with spaces`, () => {
          const userPasswordEndsSpaces = {
              username: 'test username',
              password: '1Aa!2Bb@ '
          }
          return supertest(app)
            .post('/users')
            .send(userPasswordStartsSpaces)
            .expect(400, {error: `Password must not start or end with empty spaces`})
      })

      it(`responds 400 error when password isn't complex enough`, () => {
          const userPasswordNotComplex = {
              username: 'test username',
              password: '11AAaabb'
          }
          return supertest(app)
            .post('/users')
            .send(userPasswordNotComplex)
            .expect(400, {error: `Password must contain 1 upper case, lower case, number and special character`})
      })

      it(`responds 400 'User name already taken' when user_name isn't unique`, () => {
          const duplicateUser = {
              username: 'testUser.username',
              password: '11AAaa!!',
          }
          return supertest(app)
            .post('/users')
            .send(duplicateUser)
            .expect(400, {error:`Username already taken`})
      })
    })

    context(`Happy path`, () => {
        it(`responds 201, serialized user, storing bcryped password`, () => {
            const newUser = {
                username: 'test username',
                password: '11AAaa!!',
            }
            return supertest(app)
                .post('/users')
                .send(newUser)
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.username).to.eql(newUser.username)
                    expect(res.body).to.not.have.property('password')
                    expect(res.headers.location).to.eql(`/users/${res.body.id}`)
                    const expectedDate = new Date().toLocaleString('en', {timeZone: 'UTC'})
                    const actualDate = new Date(res.body.date_created).toLocaleString()
                    expect(actualDate).to.eql(expectedDate)
                })
                .expect(res => 
                   db
                     .from('sparkle_users')
                     .select('*')
                     .where({id: res.body.id})
                     .first()
                     .then(row => {
                         expect(row.username).to.eql(newUser.username)
                         const expectedDate = new Date().toLocaleString('en', {timezone: 'UTC'})
                         const actualDate = new Date(row.date_created).toLocaleString()
                         expect(actualDate).to.eql(expectedDate)

                         return bcrypt.compare(newUser.password, row.password)
                     })
                     .then(compareMatch => {
                         expect(compareMatch).to.be.true
                     })
                )
        })
    })
  })
})