import * as express from 'express'

import {getServerConfig} from './config'
import {getLogger} from 'app/lib/logger'
import {initDatabase} from './model'
import {generateRoutes} from './route'

export let initServer =
  async function (sconf?: string, dconf?: string): Promise<express.Application> {
  try {
    let serverConfigName = sconf || 'dev'
    let databaseConfigName = dconf || 'dev'

    let config = await getServerConfig(serverConfigName)
    let logger = getLogger(config.logfile)
    let database = await initDatabase(databaseConfigName)

    // routes
    let app = express()
    app.use(generateRoutes(app, database))

    // starts the server
    let server = app.listen(config.port, config.host, () => {
      logger.info(`App listening on http://${config.host}:${config.port}`)
    })

    // logging events
    server.on('request', (req: express.Request) => {
      logger.debug(`${req.ip} -> ${req.method} ${req.url}`)
    })

    server.on('error', (err: Error) => {
      logger.error(`server error: ${err}`)
    })

    database.connection.once('disconnected', () => {
      logger.debug('server is down')
      process.exit(0)
    })

    process.once('SIGINT', () => {
      logger.info('Server is down')
      database.connection.close(() => {
        process.exit(0)
      })
    })

    return app

  } catch (err) {
    throw err
  }
}
