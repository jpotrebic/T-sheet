'use strict'

const Router = require('koa-router')

/**
 * @returns {Object} - the router
 */
module.exports = function() {
    const router = new Router({ prefix: '/api' })

    // authorization
    require('./login')(router)

    // api
    require('./entry')(router)
    require('./project')(router)
    require('./user')(router)

    return router
}
