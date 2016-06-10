import {getServerConfig, getDatabaseConfig} from './config'

import * as express from 'express'
import * as model from './model'
import {generateRoutes} from './route'

async function initServer(): Promise<void> {
  try {
    let servConf = await getServerConfig('api')
    let dbConf = await getDatabaseConfig('test')

    let database = await model.init(dbConf)
    let app = express()

    app.use(generateRoutes(app, database))

    let server = app.listen(servConf.port, servConf.host, () => {
      console.log(`App listening on http://${servConf.host}:${servConf.port}`)
    })

    server.on('close', () => {
      database.connection.close()
      console.log('Server is down')
    })

  } catch (err) {
    console.log(err)
    throw err
  }
}

initServer()
