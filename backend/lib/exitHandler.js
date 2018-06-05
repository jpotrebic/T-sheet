'use strict'

const container = require('./container')

/**
* @function exitHandler
* @param {string} signal signal code
*/
module.exports = function exitHandler(signal) {
    const logger = container.get('logger')
    logger.info(`[m ${process.pid}] -- got ${signal} signal`)
    process.exit(0)
}
