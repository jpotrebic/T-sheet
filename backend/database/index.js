'use strict'

// Module requires
const container = require('../lib/container')
const data = require('./data')
const fs = require('fs')
const promisify = require('util').promisify
const Sequelize = require('sequelize')

// async file system functions
const readdirAsync = promisify(fs.readdir)

/**
 * @function init
 * @return {array} [db, models]
 */
module.exports.init = async function() {
    const config = container.get('config').db
    const logger = container.get('logger')

    // create db instance
    const db = new Sequelize(config.name,
        config.user,
        config.pass,
        {
            host: config.host,
            port: config.port,
            dialect: 'postgres',
            logging: (msg) => logger.debug(msg),
            operatorsAliases: false,
            pool: {
                maxConnections: config.maxConnections,
                minConnections: config.minConnections,
                maxIdleTime: config.connectionIdleTime
            }
        })

    // load models
    const models = await loadModels(db)

    return [db, models]
}

/**
 * @function init
 * @return {undefined}
 */
module.exports.populate = async function() {
    const config = container.get('config').db
    const db = container.get('db')

    // clear database
    if (config.init)
        await db.dropSchema('public')
    await db.createSchema('public')

    // sync db models
    await db.sync({
        force: false,
        logging: false
    })

    // populate demo data
    if (config.init)
        await data.populate(config.init)

    return
}

/**
 * @function loadModels
 * @param {object} db - database instance
 * @return {object} models
 */
async function loadModels(db) {
    const db_dir = './backend/database/models'
    const files = await readdirAsync(db_dir)
    if (!files.length) {
        throw 'no database models found at:' + db_dir
    }

    const models = {}
    for (const file of files) {
        if (file.indexOf('.') === 0 || file.indexOf('.swp') !== -1)
            continue

        const model = db['import'](`models/${file}`)
        models[model.name] = model
    }

    for (const modelName in models)
        if ('associate' in models[modelName])
            models[modelName].associate(models)

    return models
}
