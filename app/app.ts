import {AppPlusDatabase} from './type/config.d.ts'
import * as express from 'express'
import {getServerConfig} from './config'
import {getLogger} from './lib/logger'
import {initDatabase} from './model'
import {generateRoutes} from './route'
import * as helmet from 'helmet'
import * as morgan from 'morgan'
import * as bodyParser from 'body-parser'
import * as passport from 'passport'
import {configurePassport} from './lib/auth'

/**
 * Initialize the application with the database
 * @return {Promise<AppPlusDatabase>} The express app initialized
 */
export let initAppAndDatabase = async function (): Promise<AppPlusDatabase> {
  try {
    /* config and logger init */
    let mode: string
    let logmode: string
    mode = process.env.NODE_ENV || 'development'
    mode === 'production' ? logmode = 'combined' : logmode = 'short'

    let config = await getServerConfig(mode)
    let logger = getLogger(config.logfile)

    try {
          // database and app init
          let app = express()
          let database = await initDatabase()

          /* express middlewares */

          // security
          app.use(helmet())

          // authentication
          app.use(passport.initialize())
          configurePassport(database, passport)

          // others
          if (mode === 'development') { app.use(morgan('dev')) }
          app.use(morgan(logmode, { 'stream': logger['morganStream'] }))
          app.use(bodyParser.json())
          app.use(bodyParser.urlencoded({ extended: false }))

          /* routes */
          app.use(generateRoutes(database, logger))

          /* handlers */
          // database disconnection and SIGINT handlers
          database.connection.once('disconnected', () => {
            logger.info('server is down')
            process.exit(0)
          })
          process.once('SIGINT', () => {
            logger.info('Server is down')
            database.connection.close(() => {
              process.exit(0)
            })
          })

          return {
            app: app,
            database: database,
            logger: logger
          }
    } catch (err) {
      logger.error(err)
      throw err
    }

  } catch (err) {
    console.log(err)
    throw err
  }
}
