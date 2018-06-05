'use strict'

const container = require('../container')
const HttpError = require('../HttpError')

/**
 * @param {string} model_name - db model name
 * @param {object} id - model instance id
 * @returns {object} - data from db inquiry
 */
module.exports = async function retrieveOne(model_name, id) {
    const Model = container.get('models')[model_name]
    if (!Model)
        return new HttpError(404, `db model '${model_name}' not found`)

    if (isNaN(id))
        return new HttpError(400, 'id must be a number')

    // find resource by id
    const query = { where: { id: id }}

    const response = await Model.findOne(query)
    if (!response)
        return new HttpError(404, 'resource not found')

    return response
}
