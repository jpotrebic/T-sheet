'use strict'

const container = require('../container')
const crypto = require('crypto')
const HttpError = require('../HttpError')
const jwt = require('./jwt')

/**
 * authenticate user and return access token on success
 * @param {object} credentials - user's credentials
 */
module.exports = async function authenticate(credentials) {
    if (!credentials.username || !credentials.password)
        return new HttpError(401, 'login credentials not provided')

    // hash password
    let password = credentials.password
    password = crypto.createHash('md5').update(password).digest('hex')

    // find user from credentials
    const query = {
        where: {
            username: credentials.username,
            password: password
        }
    }

    const models = container.get('models')
    const user = await models.user.findOne(query)
    if (!user)
        return new HttpError(401, 'invalid login credentials')

    // generate access and refresh tokens
    const payload = {
        uname: user.username,
        fname: user.first_name,
        lname: user.last_name,
        role: user.type
    }

    const refresh_credentials = {
        uname: user.username,
        pass: user.password,
        issuer: 'T-sheet',
        subject: 'refresh'
    }

    const tokens = await jwt.generateAccessToken(payload)
    const refresh_token = await jwt.generateRefreshToken(refresh_credentials)

    // save refresh token to user
    await user.update({ refresh_token: refresh_token })

    const response = {
        token_type: tokens.token_type,
        access_token: tokens.access_token,
        expires_in: tokens.expires_in,
        refresh_token: refresh_token,
        role: payload.role
    }

    return response
}
