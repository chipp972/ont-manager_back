import {DatabaseObject} from 'app/type/model.d.ts'
import {Express, Router} from 'express'
import * as bodyParser from 'body-parser'
import * as multer from 'multer'

export function getModelRoutes(app: Express, model: DatabaseObject): Router {
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
      .catch(err => response.status(404).send(err))
    } else {
      response.status(404).send(`no ${name} model`)
    }
  })
  .post(upload.array('files'), (request, response, next) => { // save a document
    // note : the field name must be 'files'
    let name = request.params['model']
    let obj = new model[name](request.body)

    if (!obj) {
      response.status(404).send(`no ${name} model`)
    } else {
      obj.save()
      .then((dbObj) => {
        let uri = `http://${request.headers['host']}/${name}/${dbObj.id}`

        response
        .status(201)
        .location(uri)
        .contentType('application/json')
        .set('Access-Control-Allow-Origin', '*')
        .json(dbObj)
      })
      .catch(err => response.status(403).send(err))
    }
  })

  router.route('/:model/:id')
  .get((request, response, next) => { // get a specific document
    let name = request.params['model']
    let id = request.params['id']

    model[name].findById(id)
    .then((obj) => {
      response
      .status(200)
      .contentType('application/json')
      .set('Access-Control-Allow-Origin', '*')
      .json(obj)
    })
    .catch(err => response.status(404).send(err))
  })
  .put((request, response, next) => { // update the model
    let name = request.params['model']
    let id = request.params['id']
    let updatedObj = request.body // accepts only json

    // update the obj in the database
    model[name].findById(id)
    .then((obj) => {
      // update object
      for (let prop in obj) {
        if (updatedObj.hasOwnProperty(prop)) {
          obj[prop] = updatedObj[prop]
        }
      }
      // save the new object in the database and send it in the response
      obj.save()
      .then((newObj) => {
        response
        .status(200)
        .contentType('application/json')
        .set('Access-Control-Allow-Origin', '*')
        .json(newObj)
      })
      .catch(err => response.status(500).send(err))
    })
    .catch(err => response.status(404).send(err))
  })
  .delete((request, response, next) => { // delete the model
    let name = request.params['model']
    let id = request.params['id']

    model[name].remove({ '_id': id })
    .then(() => response.status(204).send())
    .catch(err => response.status(500).send(err))
  })

  return router
}
