'use strict'

const container = require('../container')

/**
 * Prepare sequelize where query from given search word
 * @param {object} Model - Model class
 * @param {string} keyword - search keyword
 * @returns {object} - Sequelize where query options
 */
module.exports = function buildSearchQuery(Model, keyword) {
    const db = container.get('db')
    const attributes = Model.attributes
    const fields = Object.keys(Model.attributes)
    const search = '%' + keyword + '%'
    const query = []

    // search all string fields
    for (let i = 0, len = fields.length; i < len; i++) {
        const field = fields[i]
        const type = attributes[field].type.key

        if (type === 'TEXT' || type === 'STRING' || type === 'CHAR')
            query.push({[field]: {[db.Op.iLike]: search}})
    }

    return query
}
