import {DatabaseObject} from '../type/model.d.ts'
import {StockState} from '../lib/stock_state'
import {Router, Request, Response, NextFunction} from 'express'

export function getStockStateRoutes (model: DatabaseObject): Router {
  let router = Router()

  router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(['state', 'waiting'])
  })

  router.route(/\/(state|waiting)\/?$/)
  .get((req: Request, res: Response, next: NextFunction) => {
    model.place.find({}).exec()
    .then((places) => {
      res.status(200).json(
        places
        .filter((e) => { return e.internalStock })
        .map((e) => { return e._id })
      )
    }, (err) => {
      model.logger.error(err)
      return next(err)
    })
  })

  // stock state for a specific place
  router.route('/state/:id')
  .get((req: Request, res: Response, next: NextFunction) => {
    let placeId = Number(req.params['id'])
    let stockState = new StockState(placeId)

    stockState.toObject()
    .then(obj => res.status(200).json(obj))
    .catch(err => {
      model.logger.error(err)
      return next(err)
    })
  })

  // waiting stock for a specific place
  router.route('/waiting/:id')
  .get((req: Request, res: Response, next: NextFunction) => {
    let placeId = Number(req.params['id'])
    let stockState = new StockState(placeId)

    stockState.getWaitingStock()
    .then(obj => res.status(200).json(obj))
    .catch(err => {
      model.logger.error(err)
      return next(err)
    })
  })

  return router
}
