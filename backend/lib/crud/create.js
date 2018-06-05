'use strict'

const container = require('../container')
const HttpError = require('../HttpError')
const utils = require('../utils')

/**
 * @param {string} model_name - db model name
 * @param {object} values - values for new model instance
 * @returns {object} - inserted db instance
 */
module.exports = async function create(model_name, values) {
    const Model = container.get('models')[model_name]
    if (!Model)
        return new HttpError(404, `db model '${model_name}' not found`)

    const options = {
        validate: true,
        hooks: true
    }

    // hash values if necessary
    utils.hashAttributes(model_name, values)

    const response = await Model.create(values, options)
    return response
}
