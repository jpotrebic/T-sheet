'use strict'

/**
 * Send response
 * @param {object} self - request ctx
 * @param {object|array} data - response body data
 * @param {number} code - status code
 * @param {string} status - status msg
 */
module.exports = function sendResponse(self, data, code, status) {
    self.status = code || 200
    self.body = {
        status: status || 'ok',
        data: data || []
    }
}
