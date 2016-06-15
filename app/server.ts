import {getServerConfig, getDatabaseConfig} from './config'

import * as express from 'express'
import {getLogger} from './logger'
import {initDatabase} from './model'
import {generateRoutes} from './routes'

export let initServer =
  async function (sconf?: string, dconf?: string): Promise<express.Express> {
  try {
    let serverConfigName = sconf || 'dev'
    let databaseConfigName = dconf || 'dev'
    let servConf = await getServerConfig(serverConfigName)
    let dbConf = await getDatabaseConfig(databaseConfigName)

    let logger = getLogger(servConf.logfile)
    let database = await initDatabase(dbConf, logger)
    let app = express()

    app.use(generateRoutes(app, database))

    let server = app.listen(servConf.port, servConf.host, () => {
      logger.info(`App listening on http://${servConf.host}:${servConf.port}`)
    })

    server.on('request', (req: express.Request) => {
      logger.debug(`${req.ip} -> ${req.method} ${req.url}`)
    })

    server.on('error', (err) => {
      logger.error(err)
    })

    process.on('SIGINT', () => {
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
