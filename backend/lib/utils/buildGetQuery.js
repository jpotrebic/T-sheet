'use strict'

const container = require('../container')
const buildSearchQuery = require('./buildSearchQuery')

const hiddenAttributes = ['password', 'refresh_token']

/**
 * Prepare sequelize query options from given options object
 * @param {object} Model - Model class
 * @param {object} options - object containing attributes, limit, offset, sort, search and filter
 * @param {boolean} raw - return raw and nest true in query options object
 * @returns {object} - Sequelize query options
 */
module.exports = function buildGetQuery(Model, options, raw) {
    const db = container.get('db')
    const query = {}

    if (raw !== false) {
        query.raw = true
        query.nest = true
    }

    if (options.attributes)
        query.attributes = options.attributes
    else
        query.attributes = { exclude: hiddenAttributes }

    if (options.limit)
        query.limit = options.limit

    if (options.offset)
        query.offset = options.offset

    if (options.sort)
        query.order = options.sort

    query.where = {}
    if (options.search)
        query.where[db.Op.or] = buildSearchQuery(Model, options.search)

    if (options.filter) {
        const filter = options.filter
        for (let i = 0, col = Object.keys(filter), len = col.length; i < len; i++) {
            const column = col[i]
            const value = filter[column]

            if (value instanceof Array)
                query.where[column] = {[db.Op.in]: value}
            else
                query.where[column] = value
        }
    }

    return query
}
