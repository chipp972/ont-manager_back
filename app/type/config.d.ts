import * as express from 'express'
import {DatabaseObject} from './model.d.ts'
import {LoggerInstance} from 'winston'

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

export interface MailConfig extends Config {
  dev_mail: string
  api_key: string
  domain: string
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
  logger: LoggerInstance
}
