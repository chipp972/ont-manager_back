import {LoggerInstance} from 'winston'
import {Router, Request, Response, NextFunction} from 'express'

export function getErrorHandlers (logger: LoggerInstance): Router {
  let router = Router()

  // Handle 404
  router.use((req: Request, res: Response, next: NextFunction) => {
    return res.status(404).json({
      message: 'no object found',
      success: false
    })
  })

  return router
}

export function handle500 (res: Response, err: any): any {
  let msg: string
  process.env.NODE_ENV === 'production'
  ? msg = 'Internal Server Error'
  : msg = err.message

  return res.status(500).json({
    message: msg,
    success: false
  })
}
