'use strict'

const container = require('../container')
const HttpError = require('../HttpError')
const jwt = require('./jwt')

/**
 * authenticate user and return access token on success
 * @param {string} refresh_token - user's refresh token
 */
module.exports = async function refresh(refresh_token) {
    if (!refresh_token)
        return new HttpError(400, 'refresh token not provided')

    // decode refresh token
    const credentials = await jwt.decipherRefreshToken(refresh_token)
    if (!credentials)
        return new HttpError(500, 'error while deciphering refresh token')
    if (credentials instanceof Error)
        return credentials

    // find user from credentials
    const query = {
        where:
        {
            username: credentials.uname,
            password: credentials.pass,
        }
    }

    const models = container.get('models')
    const user = await models.user.findOne(query)
    if (!user)
        return new HttpError(401, 'invalid refresh credentials')

    if (user.refresh_token !== refresh_token)
        return new HttpError(401, 'refresh token was revoked')

    // generate new access token
    const payload = {
        uname: user.username,
        fname: user.first_name,
        lname: user.last_name,
        role: user.type
    }

    const tokens = await jwt.generateAccessToken(payload)

    const response = {
        token_type: tokens.token_type,
        access_token: tokens.access_token,
        expires_in: tokens.expires_in,
        refresh_token: refresh_token,
        role: payload.role
    }

    return response
}
