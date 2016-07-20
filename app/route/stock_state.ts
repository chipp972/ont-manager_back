import {DatabaseObject} from 'app/type/model.d.ts'
import {StockState} from '../lib/stock_state'
import {Router} from 'express'

export function getStockStateRoutes(model: DatabaseObject): Router {
  let router = Router()

  router.route('/stock_state/:id') // list of models available
  .get((request, response) => {
    let placeId = request.params['id']

    let stockState = new StockState(placeId)

    stockState.toObject()
    .then(obj => response.status(200).json(JSON.stringify(obj)))
    .catch(err => response.status(500).send(err))

  })

  return router
}
