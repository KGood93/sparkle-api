const AuthService = require('../auth/auth-service')

function requireAuth(req, res, next) {
    const authToken = req.get('authorization') || ''
    //console.log(authToken)
    let bearerToken
    if(!authToken.toLowerCase().startsWith('bearer ')) {
        console.log("Here")
        return res.status(401).json({error: 'Missing bearer token'})
    }
    else {
        console.log(authToken)
        console.log(authToken.length)
        bearerToken = authToken.slice(7, authToken.length)
        console.log(bearerToken)
        console.log(bearerToken.length)
    }

    try {
        const payload = AuthService.verifyJwt(bearerToken)
        console.log(payload)
        AuthService.getUserWithUserName(
            req.app.get('db'),
            payload.sub,
        )
            .then(user => {
                if (!user)
                    return res.status(401).json({error: 'Unauthorized request 1'})
                
                req.user = user
                next()
            })
            .catch(err => {
                console.error(err)
                next(err)
            })
    }
    catch(error) {
        res.status(401).json({error: 'Unauthorized request 2'})
    }
}
function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({userid: userid}, secret, {
        subject: user.username,
        algorithm: 'HS256',
    })
    return `Bearer ${token}`
}

module.exports = {
    requireAuth, makeAuthHeader
}