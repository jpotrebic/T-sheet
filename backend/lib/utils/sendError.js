'use strict'

/**
 * Send response
 * @param {object} self - request ctx
 * @param {string} message - error msg
 * @param {number} code - status code
 * @param {string} details - error details
 * @param {string} status - status msg
 */
module.exports = function sendError(self, message, code, details, status) {
    self.status = code || 400
    self.body = {
        status: status || 'error',
        data:
        {
            message: message,
            details: details
        }
    }
}
