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
      .then((objList) => {
        response
        .status(200)
        .contentType('application/json')
        .set('Access-Control-Allow-Origin', '*')
        .json(objList)
      })
      .catch((err) => response.status(404).send(err))
    } else {
      response.status(404).send(`no ${name} model`)
    }
  })
  .post(upload.array('files'), (request, response, next) => { // save a document
    // note : the field name must be 'files'
    let name = request.params['model']
    let obj = new model[name](request.body)
    // TODO : handle file upload
    if (!obj) {
      response.status(404).send(`no ${name} model`)
    } else {
      obj.save()
      .then((dbObj) => {
        let uri = `/${name}/${dbObj.id}`
        response
        .status(201)
        .location(uri)
        .contentType('application/json')
        .set('Access-Control-Allow-Origin', '*')
      })
      .catch((err) => response.status(422).send('Validation failed'))
    }
  })

  router.route('/:model/:id')
  .get((request, response, next) => { // get a specific document
    let name = request.params['model']
    let id = request.params['id']
    model[name].findOne({ 'id': id })
    .then((obj) => {
      response
      .status(200)
      .contentType('application/json')
      .set('Access-Control-Allow-Origin', '*')
      .json(obj)
    })
    .catch((err) => response.status(404).send(err))
  })
  .put((request, response, next) => { // update the model
    let name = request.params['model']
    let id = request.params['id']
    // 200 if ok
    response.status(404).send('not implemented')
  })
  .delete((request, response, next) => { // delete the model
    response.status(204)
    // 404 if not good or 403 if forbidden
  })

  // authentification routes

  return router
}
