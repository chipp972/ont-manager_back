import {DatabaseObject} from '../type/model.d.ts'
import {Router} from 'express'
import {getModelRoutes} from './model'
import {getStockStateRoutes} from './stock_state'
import {getAuthenticationRoutes} from './auth'

export function generateRoutes(model: DatabaseObject): Router {
  let router = Router()
  let routeList = ['model', 'stock_state', 'register', 'authenticate']

  router.get('/', (request, response) => {
    response
    .status(200)
    .json(routeList)
  })

  router.use('/', getAuthenticationRoutes(model))
  router.use('/stock_state', getStockStateRoutes(model))
  router.use('/model', getModelRoutes(model))

  // handle 404 not found
  router.use((request, response) => {
    response
    .status(404)
    .json({
      msg: 'no route',
      success: false
    })
  })

  return router
}
