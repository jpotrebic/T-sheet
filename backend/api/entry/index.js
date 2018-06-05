'use strict'

const container = require('../../lib/container')
const crud = require('../../lib/crud')
const utils = require('../../lib/utils')

/**
 * crud rest api for entry database model
 * @param {Object} router - the Koa router
 */
module.exports = function(router) {
    router.get('/entry/:id?', async (ctx) => {
        const logger = container.get('logger')
        logger.debug(`Started ${ctx.request.method} ${ctx.request.url}`)

        const model = 'entry'
        const id = ctx.params.id
        let result = null

        if (id)
            result = await crud.retrieveOne(model, id)
        else {
            const options = await utils.parseQS(ctx.request.query)
            let count = null

            // do not return body for HEAD requests, only headers
            if (ctx.request.method === 'HEAD')
                count = await crud.countAll(model, options)
            else {
                const data = await crud.retrieveAll(model, options)
                result = data.rows
                count = data.count
            }

            ctx.response.set('x-total-count', count)
        }

        if (result instanceof Error)
            ctx.throw(result.status || 500, result.message)

        utils.sendResponse(ctx, result)
        logger.debug(`Finished ${ctx.request.method} ${ctx.request.url}`)
    })

    router.post('/entry', async (ctx) => {
        const logger = container.get('logger')
        logger.debug(`Started ${ctx.request.method} ${ctx.request.url}`)

        const model = 'entry'
        const body = ctx.request.body

        const result = await crud.create(model, body, ctx.request)

        if (!result)
            ctx.throw(500)
        if (result instanceof Error)
            ctx.throw(result.status || 400, result.message)

        utils.sendResponse(ctx, result)
        logger.debug(`Finished ${ctx.request.method} ${ctx.request.url}`)
    })

    router.put('/entry/:id', async (ctx) => {
        const logger = container.get('logger')
        logger.debug(`Started ${ctx.request.method} ${ctx.request.url}`)

        const model = 'entry'
        const id = ctx.params.id
        const body = ctx.request.body

        const result = await crud.update(model, id, body)

        if (!result)
            ctx.throw(500)
        if (result instanceof Error)
            ctx.throw(result.status || 400, result.message)

        if (result[0] === 0)
            ctx.throw(404, 'resource not found')

        utils.sendResponse(ctx, result[1][0])
        logger.debug(`Finished ${ctx.request.method} ${ctx.request.url}`)
    })

    router.delete('/entry/:id', async (ctx) => {
        const logger = container.get('logger')
        logger.debug(`Started ${ctx.request.method} ${ctx.request.url}`)

        const model = 'entry'
        const id = ctx.params.id

        const result = await crud.deleteOne(model, id)

        if (!result)
            ctx.throw(500)
        if (result instanceof Error)
            ctx.throw(result.status || 400, result.message)

        utils.sendResponse(ctx, {}, 204)
        logger.debug(`Finished ${ctx.request.method} ${ctx.request.url}`)
    })
}
