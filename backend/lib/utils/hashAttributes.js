'use strict'

const crypto = require('crypto')

/**
 * Hash sensitive information before storing in db
 * @param {object} model_name - db model name
 * @param {object} values - values for new model instance
 */
module.exports = function hashAttributes(model_name, values) {
    // model: [[attribute, algorithm], [...], ...]
    const hashValues = {
        auth_user: [['password', 'md5']],
        cdr: [['hash', 'md5']],
        profile: [['main_pin', 'sha256']],
        subscriber: [['password', 'sha256']]
    }

    const regEx = {
        sha256: /^[a-f0-9]{64}$/i,
        md5: /^[a-f0-9]{32}$/i
    }

    if (hashValues[model_name]) {
        for (const pair of hashValues[model_name]) {
            const attr = pair[0]
            const alg = pair[1]

            if (values[attr] !== undefined && !regEx[alg].test(values[attr]))
                values[attr] = crypto.createHash(alg).update(values[attr]).digest('hex')
        }
    }
}
