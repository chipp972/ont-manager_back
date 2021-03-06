import {getServerConfig} from './config'
import {getLogger} from './lib/logger'
import {initAppAndDatabase} from './app'

initServer()

/**
 * Start the server
 */
async function initServer (): Promise<void> {
  try {
    /* config and logger init */
    let mode: string
    mode = process.env.NODE_ENV || 'development'

    let config = await getServerConfig(mode)
    let logger = getLogger(config.logfile)

    try {
      let appPlusDb = await initAppAndDatabase()
      let app = appPlusDb.app
      app.set('port', config.port)

      // Create HTTP server which listen on provided port
      // and on all network interfaces.
      let server = app.listen(config.port, config.host)

      // Handle server errors
      server.on('error', (err) => {
        if (err['syscall'] !== 'listen') {
          logger.error(err.message)
          throw err
        }

        let bind = `Port ${config.port}`

        switch (err['code']) {
          case 'EACCES':
            logger.error(`${bind} requires elevated privileges`)
            process.exit(1)
            break
          case 'EADDRINUSE':
            logger.error(`${bind} is already in use`)
            process.exit(1)
            break
          default:
            logger.error(err.message)
            throw err
        }
      })

      server.on('listening', () => {
        let addr = server.address()
        let bind = typeof addr === 'string' ? `pipe ${addr}`
        : `port ${addr.port}`
        logger.info(`Server Listening on ${bind}`)
      })

    } catch (err) {
      logger.error(err)
      throw err
    }

  } catch (err) {
    console.log(err)
    throw err
  }
}
