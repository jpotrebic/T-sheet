'use strict'

const container = require('../container')
const HttpError = require('../HttpError')

/**
 * @param {string} model_name - db model name
 * @param {object} id - model instance id
 * @returns {object} - inserted db instance
 */
module.exports = async function deleteOne(model_name, id) {
    const Model = container.get('models')[model_name]
    if (!Model)
        return new HttpError(404, `db model '${model_name}' not found`)

    const options = {
        validate: true,
        hooks: true,
        individualHooks: true,
        returning: true,
        where: { id: id }
    }

    const response = await Model.destroy(options)
    if (!response)
        return new HttpError(404, 'resource not found')

    return response
}
