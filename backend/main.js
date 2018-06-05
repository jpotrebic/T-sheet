'use strict'

// Module requires
const bodyParser = require('koa-bodyparser')
const cluster = require('cluster')
const container = require('./lib/container')
const cors = require('kcors')
const database = require('./database')
require('dotenv').config()
const exitHandler = require('./lib/exitHandler')
const fs = require('fs')
const http = require('http')
const https = require('https')
const Koa = require('koa')
const parseFlags = require('./lib/parseFlags')
const promisify = require('util').promisify
const requestHandler = require('./lib/requestHandler')
const winston = require('winston')

// async file system functions
const readFileAsync = promisify(fs.readFile)

// parse server configuration
const config = parseFlags()

/**
 * Server main application function
 */
module.exports = async function main() {
    container.set('config', config)

    // console.log(require('util').inspect(config, { depth: null }));

    // logger setup
    const logger = new (winston.Logger)({
        level: config.log.level,
        transports: [new (winston.transports.Console)()]
    })
    container.set('logger', logger)
    logger.info('Initialized logger')

    try {
        // start koa
        const app = new Koa()

        // load server certificates
        const https_options = {}
        https_options.key = await readFileAsync(config.server.https.tls.key)
        https_options.cert = await readFileAsync(config.server.https.tls.cert)

        // database setup
        const [db, models] = await database.init()
        container.set('db', db)
        container.set('models', models)
        logger.info('Initialized database')

        // MASTER PROCESS
        if (cluster.isMaster) {
            // populate database
            await database.populate()
            logger.info('Populated database')

            // run workers
            const workers = {}
            for (let i = 0; i < 4; i++) {
                const worker = cluster.fork()
                workers[worker.id] = worker

                // receive messages from workers
                worker.on('message', async (msg) => {
                    logger.debug(`[pid ${process.pid}] -- `,
                        `received message from worker ${worker.id}:`, msg)

                    // send data from workers to cluster and vice versa
                    for (const worker of workers) {
                        worker.send(msg)
                    }
                })
            }

            process.on('SIGINT', () => {
                exitHandler('SIGINT')
            })
            process.on('SIGTERM', () => {
                exitHandler('SIGTERM')
            })
            process.on('SIGHUP', () => {
                exitHandler('SIGHUP')
            })

            process.on('exit', () => {
                logger.info(`[m ${process.pid}] -- server shut down correctly.\n`)
            })

            process.on('uncaughtException', (err) => {
                logger.error(`Caught exception: ${err} ${err.stack}`)
                process.exit(1)
            })

            process.on('unhandledRejection', (err) => {
                logger.error(`[m ${process.pid}] Caught rejection: ${err}`)
            })
        // WORKER PROCESSES
        } else {
            // access, error and 404 handler
            app.use(requestHandler())

            app.use(cors())

            // parse body
            app.use(bodyParser({
                extendTypes: {
                    text: ['application/xml']
                },
                enableTypes: ['json', 'form', 'text']
            }))

            // load routes
            app.use(require(`./api`)().routes())
            logger.info(`[pid ${process.pid}] loaded routes`)

            // server startup
            http.createServer(app.callback()).listen(config.server.http.port)
            https.createServer(https_options, app.callback()).listen(config.server.https.port)
            logger.info(`[pid ${process.pid}] -- listening on ports:`,
                `${config.server.http.port} ${config.server.https.port}`)

            // receive a message from master
            process.on('message', (message) => {
                logger.info(`[pid ${process.pid}] -- received message from master: ${message}`)
            })
        }
    } catch (error) {
        logger.error(`${error}`)
        logger.error('-- stack trace --')
        logger.error(error.stack)
        process.exit(1)
    }
}
