import {DatabaseConfig} from 'app/config/config.d.ts'
import {DatabaseObject} from './model.d.ts'

import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'
import {LoggerInstance} from 'winston'

// mongoose plugins initialization
autoIncr.initialize(mongoose.connection) // auto increment

// models
import {User} from './user'
import {Category} from './category'
import {SubCategory} from './sub_category'
import {Company} from './company'
import {Place} from './place'
import {Order} from './order'

export function initDatabase (config: DatabaseConfig, logger: LoggerInstance):
Promise<DatabaseObject> {
  let uri: string
  uri = `${config.type}://${config.host}:${config.port}/${config.database}`

  return new Promise<DatabaseObject>((resolve, reject) => {
    mongoose.connect(uri, config)
    mongoose.connection.once('connected', () => {
      logger.info('database connection: success')

      resolve({
        category: Category,
        company: Company,
        connection: mongoose.connection,
        order: Order,
        place: Place,
        subCategory: SubCategory,
        user: User
      })
    })

    mongoose.connection.once('error', (err) => {
      logger.error(`database error: ${err}`)
      reject(err)
    })
  })
}
