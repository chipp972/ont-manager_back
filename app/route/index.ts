import {DatabaseObject} from 'app/type/model.d.ts'
import {Router} from 'express'
import {getModelRoutes} from './model'
import {getStockStateRoutes} from './stock_state'

export function generateRoutes(model: DatabaseObject): Router {
  let router = Router()

  router.use(getStockStateRoutes(model))
  router.use(getModelRoutes(model))

  return router
}
