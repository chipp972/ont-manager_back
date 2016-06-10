import {DatabaseConfig} from 'app/config/config.d.ts'
import {DatabaseObject} from './model.d.ts'
import * as mongoose from 'mongoose'

// models
import {User} from './user'

export function init (config: DatabaseConfig): Promise<DatabaseObject> {
  let uri: string
  uri = `${config.type}://${config.host}:${config.port}/${config.database}`

  return new Promise<DatabaseObject>((resolve, reject) => {
    mongoose.connect(uri, config)
    mongoose.connection.on('connected', () => {
      resolve({
        connection: mongoose.connection,
        user: User
      })
    })

    mongoose.connection.on('error', (err) => {
      reject(err)
    })

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose default connection disconnected')
    })

    process.on('SIGINT', () => {
      mongoose.connection.close(() => {
        process.exit(0)
      })
    })
  })
}
