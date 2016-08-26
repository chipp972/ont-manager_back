import {LoggerInstance} from 'winston'
import {Router, Request, Response, NextFunction} from 'express'

export function getErrorHandlers (logger: LoggerInstance): Router {
  let router = Router()

  // Handle 404
  router.use((req: Request, res: Response, next: NextFunction) => {
    let err: Error = new Error('Not found')
    err['status'] = 404
    next(err)
  })

  return router
}
