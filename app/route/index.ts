import {DatabaseObject} from 'app/model/model.d.ts'
import {Express, Router} from 'express'
import * as bodyParser from 'body-parser'
import * as multer from 'multer'

export function generateRoutes(app: Express, model: DatabaseObject): Router {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  let router = Router()
  let upload = multer()

  router.route('/') // list of models available
  .get((request, response) => {
    let modelList: string[] = []
    for (let prop in model) {
      if (model.hasOwnProperty(prop) && prop !== 'connection') {
        modelList.push(prop)
      }
    }
    response.status(200).json(modelList)
  })

  router.route('/:model') // list of documents for this model
  .get((request, response, next) => {
    let name = request.params['model']
    if (model[name]) {
      model[name].find()
      .then((objList) => response.status(200).json(objList))
      .catch((err) => response.status(404).send(err))
    } else {
      response.status(404).send(`no ${name} model`)
    }
  })
  .post((request, response, next) => { // save a document in this model
    // create a new model
    let reqModel = request.params['model']
    let id: number
    let uri = `/${reqModel}/${id}`
    response.status(201).location(uri)
    // error 422 if validation failed
  })

  router.route('/:model/:id')
  .get((request, response, next) => { // get a specific document
    model[request.params['model']].findOne({ 'id': request.params['id'] })
    .then((obj) => response.status(200).json(obj))
    .catch((err) => response.status(404).send(err))
  })
  .put((request, response, next) => { //
    // update the model
    // 200 if ok
    response.status(404).send('not implemented')
  })
  .delete((request, response, next) => {
    // delete the model
    response.status(204)
    // 404 if not good or 403 if forbidden
  })

  return router
}
