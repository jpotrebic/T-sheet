'use strict'

// error containing http status code
module.exports = class HttpError extends Error {
    /**
     * @param {number} [code] - http error status code
     * @param {array} [params] - other error parameters [message[, fileName[, lineNumber]]]
     */
    constructor(code, params) {
        // Pass error arguments
        super(params)

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace)
            Error.captureStackTrace(this, HttpError)

        // Custom error information
        this.status = code
    }
}
