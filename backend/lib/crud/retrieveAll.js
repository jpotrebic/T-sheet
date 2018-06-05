'use strict'

const container = require('../container')
const HttpError = require('../HttpError')
const utils = require('../utils')

/**
 * @param {string} model_name - db model name
 * @param {object} options - object containing limit, offset, sort, search and filter
 * @returns {object} - data from db inquiry
 */
module.exports = async function retrieveAll(model_name, options) {
    const Model = container.get('models')[model_name]
    if (!Model)
        return new HttpError(404, `db model '${model_name}' not found`)

    const query = utils.buildGetQuery(Model, options)
    const response = await Model.findAndCountAll(query)

    return response
}
