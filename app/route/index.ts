import {DatabaseObject} from 'app/type/model.d.ts'
import {Router, Application} from 'express'
import {getModelRoutes} from './model'
import {getStockStateRoutes} from './stock_state'

export function generateRoutes(app: Application, model: DatabaseObject): Router {
  let router = Router()

  router.use(getStockStateRoutes(model))
  router.use(getModelRoutes(app, model))

  return router
}
