'use strict'

/**
 * Get a random number between min and max rounded up to 2 decimals
 * @param {number} min -
 * @param {number} max -
 */
module.exports.decimal = function(min, max) {
    min = Math.ceil(min*100)
    max = Math.floor(max*100)

    return (Math.floor(Math.random() * (max - min + 1)) + min) / 100
}

/**
 * Get a random number between min and max rounded up to 2 decimals
 * @param {number} min -
 * @param {number} max -
 */
module.exports.integer = function(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)

    return Math.floor(Math.random() * (max - min + 1)) + min
}
