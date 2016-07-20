import {DatabaseObject} from 'app/type/model.d.ts'
import {Express, Router} from 'express'
import {getModelRoutes} from './model'
import {getStockStateRoutes} from './stock_state'

export function generateRoutes(app: Express, model: DatabaseObject): Router {
  let router = Router()

  router.use(getStockStateRoutes(model))
  router.use(getModelRoutes(app, model))

  return router
}
