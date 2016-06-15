import {DatabaseConfig} from 'app/config/config.d.ts'
import {DatabaseObject} from './model.d.ts'

import * as mongoose from 'mongoose'
import {LoggerInstance} from 'winston'

// models
import {Dsp} from './dsp'
import {Equipment} from './equipment'
import {EquipmentType} from './equipment_type'
import {Order} from './order'
import {Society} from './society'
import {User} from './user'

export let initDatabase =
 function (config: DatabaseConfig, logger: LoggerInstance): Promise<DatabaseObject> {
  let uri: string
  uri = `${config.type}://${config.host}:${config.port}/${config.database}`

  return new Promise<DatabaseObject>((resolve, reject) => {
    mongoose.connect(uri, config)
    mongoose.connection.on('connected', () => {
      resolve({
        connection: mongoose.connection,
        dsp: Dsp,
        equipment: Equipment,
        equipmentType: EquipmentType,
        order: Order,
        society: Society,
        user: User
      })
    })

    mongoose.connection.on('error', (err) => {
      logger.error(`mongoose error: ${err}`)
      reject(err)
    })

    mongoose.connection.on('disconnected', () => {
      logger.info(`mongoose disconnected`)
    })
  })
}
