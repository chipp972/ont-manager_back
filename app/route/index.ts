import {DatabaseObject} from '../type/model.d.ts'
import {Router} from 'express'
import {LoggerInstance} from 'winston'
import {getModelRoutes} from './model'
import {getStockStateRoutes} from './stock_state'
import {getAuthenticationRoutes} from './auth'
import {getErrorHandlers} from './error'

export function generateRoutes (model: DatabaseObject,
  serverLogger: LoggerInstance): Router {

  let router = Router()

  let routeList = ['model', 'stock_state', 'register', 'signin']
  router.get('/', (request, response) => {
    response
    .status(200)
    .json(routeList)
  })

  process.env.NODE_ENV === 'production'
  ? router.use('/', getAuthenticationRoutes(model))
  : serverLogger.info('authentication disabled in development')

  router.use('/model', getModelRoutes(model))
  router.use('/stock_state', getStockStateRoutes(model))

  router.use(getErrorHandlers(serverLogger))

  return router
}
