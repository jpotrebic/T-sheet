'use strict'

const container = require('../../lib/container')
const auth = require('../../lib/auth')
const jwt = require('../../lib/auth/jwt')
const utils = require('../../lib/utils')

/**
 * login routes
 * @param {Object} router - the Koa router
 */
module.exports = function(router) {
    const logger = container.get('logger')

    // authentication
    router.post('/login', async (ctx) => {
        logger.debug(`Started ${ctx.request.method} ${ctx.request.url} ...`)

        const body = ctx.request.body
        const result = await auth.authenticate(body)
        if (!result)
            ctx.throw(500)
        if (result instanceof Error)
            ctx.throw(result.status || 401, result.message)

        utils.sendResponse(ctx, result)
    })

    // refresh authentication
    router.post('/refresh', async (ctx) => {
        logger.debug(`Started ${ctx.request.method} ${ctx.request.url} ...`)

        const result = await auth.refresh(ctx.request.body.refresh_token)
        if (!result)
            ctx.throw(500)
        if (result instanceof Error)
            ctx.throw(result.status || 401, result.message)

        utils.sendResponse(ctx, result)
    })

    // authorization
    router.all('*', async (ctx, next) => {
        let authorization = ctx.request.headers.authorization

        // if no authorization header is present
        if (!authorization)
            ctx.throw(401)

        const auth_data = authorization.split(' ')
        if (!auth_data[1])
            ctx.throw(401, 'authorization credentials not provided')

        const payload = await jwt.verifyAccessToken(auth_data[1])
        if (!payload)
            ctx.throw(401)
        if (payload instanceof Error)
            ctx.throw(payload.status || 401, payload.message)

        // set state
        ctx.state.role = payload.role
        ctx.state.username = payload.uname

        // check permissions
        if (ctx.state.role !== 'ADMIN' && ctx.method !== 'GET' && ctx.request.path !== '/api/entry')
            ctx.throw(403, "user doesn't have permissions to change this data")

        return await next()
    })

    router.post('/logout', async (ctx) => {
        logger.debug(`Started ${ctx.request.method} ${ctx.request.url} ...`)

        const credentials = {
            role: ctx.state.role,
            username: ctx.state.username
        }

        const result = await auth.revoke(credentials)
        if (!result)
            ctx.throw(500)

        if (result instanceof Error)
            ctx.throw(result.status || 401, result.message)

        utils.sendResponse(ctx, {}, 204)
    })

    return router
}
