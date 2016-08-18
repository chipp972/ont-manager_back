import * as express from 'express'
import {DatabaseObject} from './model.d.ts'

interface Config {
  name: string
  user?: string
  password?: string
  pass?: string
  logfile: string
}

export interface ServerConfig extends Config {
  host: string
  port: number
}

declare enum DatabaseType {
  'mysql', 'mongodb', 'sqlite'
}

export interface DatabaseConfig extends Config {
  host: string
  port: number
  database: string
  type: DatabaseType
  file?: string // filepath of the database for sqlite only
  tokenSalt?: string
}

export interface AppPlusDatabase {
  app: express.Application
  database: DatabaseObject
}
