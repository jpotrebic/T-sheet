'use strict'

const container = require('./container')
const utils = require('./utils')

/**
 * Response time, error and 404 handler
 * @returns {function} -
 */
module.exports = function requestHandler() {
    return async (ctx, next) => {
        const logger = container.get('logger')
        const start = Date.now()
        try {
            await next()

            if (!ctx.body && ctx.status == 404)
                ctx.throw(404)

        } catch (error) {
            utils.sendError(ctx, error.message, error.status, error.name)
        }

        const state = ctx.state
        let ip = `${ctx.ip}`

        if (state.subscriberUid)
            ip = ip.concat(' ', state.subscriberUid)

        if (state.deviceUid)
            ip = ip.concat(' ', state.deviceUid)

        const ms = Date.now() - start
        logger.info(`[pid ${process.pid}] ${ip}: ${ctx.status}`,
            `${ctx.method} ${ctx.url} ${ms}ms`)
    }
}
