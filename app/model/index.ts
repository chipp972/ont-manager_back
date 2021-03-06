import {DatabaseObject} from '../type/model.d.ts'

import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'

import {getDatabaseConfig} from '../config'
import {getLogger} from '../lib/logger'

// mongoose promise change
// tslint:disable
mongoose.Promise = require('bluebird')
// tslint:enable

// mongoose plugins initialization
autoIncr.initialize(mongoose.connection) // auto increment

// models
import {AlertModel} from './alert'
import {AttachmentModel} from './attachment'
import {DeliveryModel} from './delivery'
import {PlaceModel} from './place'
import {ProductModel} from './product'
import {UserModel} from './user'
import {OrderModel} from './order'
import {StockModel} from './stock'

export async function initDatabase (): Promise<DatabaseObject> {
  try {
    let mode: string
    mode = process.env.NODE_ENV || 'development'

    let config = await getDatabaseConfig(mode)
    let logger = getLogger(config.logfile)

    let uri: string
    uri = `${config.type}://${config.host}:${config.port}/${config.database}`

    return new Promise<DatabaseObject>((resolve, reject) => {
      mongoose.connect(uri, config)

      mongoose.connection.once('connected', () => {
        logger.info('database connection: success')

        resolve({
          alert: AlertModel,
          attachment: AttachmentModel,
          connection: mongoose.connection,
          delivery: DeliveryModel,
          logger: logger,
          order: OrderModel,
          place: PlaceModel,
          product: ProductModel,
          stock: StockModel,
          tokenSalt: config.tokenSalt,
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
        logger.info('database connection: ended')
      })
    })

  } catch (err) {
    throw err
  }
}
