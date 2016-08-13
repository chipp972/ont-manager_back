import {DatabaseObject} from '../type/model.d.ts'
import {StockState} from '../lib/stock_state'
import {Router} from 'express'

export function getStockStateRoutes(model: DatabaseObject): Router {
  let router = Router()

  router.get('/', (request, response) => {
    model.place.find({}).exec()
    .then((documents) => {
      response.status(200).json(documents.map((e) => { return e._id }))
    })
  })

  // stock state for a specific place
  router.get('/:id', (request, response) => {
    let placeId = request.params['id']
    let stockState = new StockState(placeId)
    console.log('haah')

    stockState.toObject()
    .then(obj => response.status(200).json(obj))
    .catch(err => {
      model.logger.error(err)
      response.status(500).send(err)
    })
  })

  return router
}
