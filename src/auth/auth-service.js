const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

const AuthService = {
    getUserWithUserName(db, username) {
        return db('sparkle_users')
            .where({username})
            .first()
    },
    comparePasswords(password, hash) {
        return bcrypt.compare(password, hash)
    },
    createJwt(subject, payload) {
        return jwt.sign(payload, config.JWT_SECRET, {
            subject,
            expiresIn: config.JWT_EXPIRY,
            algorithm: 'HS256',
        })
    },
    verifyJwt(token) {
        //console.log(token, config.JWT_SECRET)
        //console.log(jwt.verify(token, config.JWT_SECRET))
        return jwt.verify(token, config.JWT_SECRET, {
            algorithms: ['HS256'],
        })
    },

    parseBasicToken(token) {
        
    }
}

module.exports = AuthService