import * as express from 'express'
import {getServerConfig} from './config'
import {getLogger} from './lib/logger'
import {initDatabase} from './model'
import {generateRoutes} from './route'
import * as helmet from 'helmet'
import * as morgan from 'morgan'
import * as bodyParser from 'body-parser'
import * as multer from 'multer'

/**
 * Initialize the server with the database
 * @return {Promise<express.Application>} The express app initialized
 */
export let initServer = async function (): Promise<express.Application> {
  try {
    /* config and logger init */
    let mode: string
    let logmode: string
    process.env.NODE_ENV === 'production' ? mode = 'production' : mode = 'dev'
    mode === 'production' ? logmode = 'combined' : logmode = 'dev'

    let config = await getServerConfig(mode)
    let logger = getLogger(config.logfile)

    try {
          // database and app init
          let app = express()
          let database = await initDatabase()

          /* express middlewares */

          // security
          app.use(helmet())

          // others
          // app.use(morgan(logmode, { 'stream': logger.stream }))
          app.use(morgan(logmode))
          app.use(bodyParser.json())
          app.use(bodyParser.urlencoded({ extended: true }))
          app.use(multer)

          /* routes */
          app.use(generateRoutes(database))

          /* handlers */

          // errror handler
          app.use((err, request, response) => {
            response.status(err.status || 500)
            response.render('error', {
              error: {},
              message: err.message
            })
          })

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

          return app
    } catch (err) {
      logger.error(err)
      throw err
    }

  } catch (err) {
    console.log(err)
    throw err
  }
}
