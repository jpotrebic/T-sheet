'use strict'

class Container {
    constructor() {
        this.reset()
    }

    reset() {
        this._instances = Object.create(null)
    }

    /**
     * @param {string} name - service name
     * @returns {Object} - the service
     */
    get(name) {
        let service = this._instances[name]
        return service
    }

    /**
     * @param {string} name - service name
     * @param {Object} value - the service
     */
    set(name, value) {
        this._instances[name] = value
    }

    /**
     * @param {string} name - service name
     */
    remove(name) {
        delete this._instances[name]
    }
}

module.exports = new Container
