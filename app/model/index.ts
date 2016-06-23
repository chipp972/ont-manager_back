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
import {Category} from './category'
import {Place} from './place'
import {User} from './user'
import {Order} from './order'

export async function initDatabase (configName: string):
Promise<DatabaseObject> {
  try {
    let config = await getDatabaseConfig(configName)
    let logger = getLogger(config.logfile)

    let uri: string
    uri = `${config.type}://${config.host}:${config.port}/${config.database}`

    let dbObjPromise = new Promise<DatabaseObject>((resolve, reject) => {
      mongoose.connect(uri, config)
      mongoose.connection.once('connected', () => {
        logger.info('database connection: success')

        resolve({
          category: Category,
          connection: mongoose.connection,
          order: Order,
          place: Place,
          user: User
        })
      })

      mongoose.connection.on('error', (err) => {
        logger.error(`database error: ${err}`)
        if (! dbObjPromise.isFulfilled) {
          reject(err)
        }
      })

      mongoose.connection.on('disconnected', () => {
        logger.debug('database connection: ended')
      })
    })

    return dbObjPromise

  } catch (err) {
    throw err
  }
}
