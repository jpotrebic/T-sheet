'use strict'

const config = require('../config')

/**
 * Parse flag arguments and save server configuration
 */
module.exports = function parseFlags() {
    // flags
    const argv = require('yargs')
        .usage('Usage: npm start -- [options]')
        .option('http-port',
            {
                describe: 'Http server port',
                type: 'number'
            })
        .option('https-port',
            {
                describe: 'Https server port',
                type: 'number'
            })
        .option('db-name',
            {
                describe: 'Database name',
                type: 'string'
            })
        .option('db-init',
            {
                describe: 'Populate database tables with initial data',
                type: 'string',
                choices: [false, 'demo', 'test']
            })
        .option('log-level',
            {
                describe: 'Set log level',
                type: 'string',
                default: 'info',
                choices: ['trace', 'debug', 'info', 'warn', 'error', 'fatal']
            })
        .help('h')
        .alias('h', 'help')
        .argv

    // server conf
    if (argv['http-port'])
        config.server.http.port = parseInt(argv['http-port'])
    if (argv['https-port'])
        config.server.https.port = parseInt(argv['https-port'])

    // db conf
    if (argv['db-name'])
        config.db.name = argv['db-name']
    if (argv['db-init'])
        config.db.init = argv['db-init']

    // log level conf
    if (argv['log-level'])
        config.log.level = argv['log-level']

    return config
}
