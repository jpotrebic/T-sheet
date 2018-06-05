
'use strict'

const config = require('../../config')
const crypto = require('crypto')
const fs = require('fs')
const jwt = require('jsonwebtoken')

const iv = Buffer.alloc(16)
iv.write('zKjM6HxkLYdqJz+qGfCufHSetktokdWvvFJ59hAO5Ez=', 0)
const private_key = fs.readFileSync(config.auth.jwt.secret_key, { encoding: 'utf8' })
const cypher_key = crypto.createHash('sha256').update(private_key, 'buffer').digest()

/**
 * create access token
 * @param {object} payload - user's credentials
 */
module.exports.generateAccessToken = function(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            private_key,
            {
                algorithm: config.auth.jwt.algorithm || 'HS256',
                issuer: 'uniqCast',
                subject: 'login',
                expiresIn: config.auth.jwt.ttl || '1800'
            },
            (error, access_token) => {
                if (error)
                    return reject(error)

                resolve({
                    token_type: 'Bearer',
                    access_token: access_token,
                    expires_in: config.auth.jwt.ttl || '1800'
                })
            })
    })
}

/**
 * verify access token
 * @param {string} token - access token
 */
module.exports.verifyAccessToken = function(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, private_key, (error, payload) => {
            if (error)
                return reject(error)

            resolve(payload)
        })
    })
}

/**
 * create refresh token
 * @param {object} credentials - user's credentials
 */
module.exports.generateRefreshToken = function(credentials) {
    return new Promise((resolve, reject) => {
        try {
            const cypher = crypto.createCipheriv('aes-256-cbc', cypher_key, iv)
            const rt_header = crypto.randomBytes(32).toString('base64')

            let rt_body = cypher.update(JSON.stringify(credentials), 'utf8', 'base64')
            rt_body += cypher.final('base64')
            const refresh_token = rt_header + '$' + rt_body

            resolve(refresh_token)
        } catch (error) { return reject(error) }
    })
}

/**
 * decode refresh token
 * @param {string} refresh_token - user's refresh token
 */
module.exports.decipherRefreshToken = function(refresh_token) {
    return new Promise((resolve, reject) => {
        let data = null
        const base64Regex = /^(?:[A-Z0-9+/]{4})*(?:[A-Z0-9+/]{2}==|[A-Z0-9+/]{3}=|[A-Z0-9+/]{4})$/i
        try {
            const isBase64 = base64Regex.test(refresh_token.split('$')[1])
            if (refresh_token.split('$')[1]) {
                if (!isBase64)
                    throw  'invalid refresh token'
            } else
                throw 'invalid refresh token'

            const decypher = crypto.createDecipheriv('aes-256-cbc', cypher_key, iv)
            data = decypher.update(refresh_token.split('$')[1], 'base64', 'utf8')
            data += decypher.final('utf8')
        } catch (error) { return reject(error) }

        data = JSON.parse(data)
        resolve(data)
    })
}
