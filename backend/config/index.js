const config =
{
    // Server configuration
    server: {
        http: {
            port: parseInt(process.env.TSHEET_SERVER_HTTP_PORT, 10) || 1080
        },
        https: {
            port: parseInt(process.env.TSHEET_SERVER_HTTPS_PORT, 10) || 1443,
            tls: {
                key: process.env.TSHEET_SERVER_TLS_KEY || './backend/certs/tls-key.pem',
                cert: process.env.TSHEET_SERVER_TLS_CERT || './backend/certs/tls-cert.pem',
            }
        }
    },

    // Logger
    log: {
        level: process.env.TSHEET_LOG_LEVEL || 'info',
    },

    // Database
    db: {
        user: process.env.TSHEET_DB_USER || 'postgres',
        pass: process.env.TSHEET_DB_PASSWORD || 'postgres',
        host: process.env.TSHEET_DB_HOST || '127.0.0.1',
        port: parseInt(process.env.TSHEET_DB_PORT) || 5432,
        type: process.env.TSHEET_DB_TYPE || 'postgres',
        name: process.env.TSHEET_DB_NAME || 't_sheet',

        // pool
        max_conn: parseInt(process.env.TSHEET_DB_MAX_CONN, 10) || 25,
        min_conn: parseInt(process.env.TSHEET_DB_MIN_CONN, 10) || 1,
        conn_idle_time: parseInt(process.env.TSHEET_DB_CONN_IDLE_TIME, 10) || 10000,

        // initial data
        init: process.env.TSHEET_DB_INIT
    },

    // Authorization setup
    auth: {
        jwt: {
            ttl: process.env.TSHEET_AUTH_JWT_TTL || '1800000',
            algorithm: process.env.TSHEET_AUTH_JWT_ALGORITHM || 'HS256',
            secret_key: process.env.TSHEET_AUTH_JWT_SECRET_KEY || './backend/certs/jwt.key'
        }
    }
}

module.exports = config
