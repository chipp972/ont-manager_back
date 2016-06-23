import {DatabaseObject} from 'app/type/model.d.ts'
import {Express, Router} from 'express'
import {getModelRoutes} from './model'

export function generateRoutes(app: Express, model: DatabaseObject): Router {
  let router = Router()

  router.use(getModelRoutes(app, model))

  return router
}
