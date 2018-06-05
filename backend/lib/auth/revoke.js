'use strict'

const container = require('../container')
const HttpError = require('../HttpError')

/**
 * revoke refresh token from user
 * since refresh tokens never expire it is important to be able to revoke them
 * we can revoke a refresh token either by posting a request
 * to the Authentication API /auth/logout endpoint
 *
 * @param {object} credentials - user's credentials
 */
module.exports = async function revoke(credentials) {
    if (!credentials.username)
        return new HttpError(401, 'logout credentials not provided')

    // remove user's refresh_token from database
    const values = { refresh_token: null }
    const query = { where: { username: credentials.username }}

    const models = container.get('models')
    const user = await models.user.update(values, query)

    if (!user)
        return new HttpError(500, 'internal server error')

    return user
}
