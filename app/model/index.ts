import {DatabaseObject} from 'app/type/model.d.ts'

import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'

import {getDatabaseConfig} from 'app/config'
import {getLogger} from 'app/lib/logger'

// mongoose plugins initialization
autoIncr.initialize(mongoose.connection) // auto increment

/**
 * TODO can't do it because of fail typings definition
 * mongoose.Promise = global.Promise
 */

// models
import {CategoryModel} from './category'
import {PlaceModel} from './place'
import {UserModel} from './user'
import {OrderModel} from './order'

export async function initDatabase (configName: string):
Promise<DatabaseObject> {
  try {
    let config = await getDatabaseConfig(configName)
    let logger = getLogger(config.logfile)

    let uri: string
    uri = `${config.type}://${config.host}:${config.port}/${config.database}`

    return new Promise<DatabaseObject>((resolve, reject) => {
      mongoose.connect(uri, config)

      mongoose.connection.once('connected', () => {
        logger.info('database connection: success')

        resolve({
          category: CategoryModel,
          connection: mongoose.connection,
          order: OrderModel,
          place: PlaceModel,
          user: UserModel
        })
      })

      mongoose.connection.on('error', (err) => {
        logger.error(`database error: ${err}`)
        if (! this.isResolved) {
          reject(err)
        }
      })

      mongoose.connection.on('disconnected', () => {
        logger.debug('database connection: ended')
      })
    })

  } catch (err) {
    throw err
  }
}
