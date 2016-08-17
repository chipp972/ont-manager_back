import {DatabaseObject} from '../type/model.d.ts'
import {Router} from 'express'

export function getModelRoutes(model: DatabaseObject): Router {
  let router = Router()

  let modelList: Array<string> = Object.keys(model).filter((e) => {
    return (e !== 'connection' && e !== 'logger' && e !== 'tokenSalt')
  })

  router.route('/') // list of models available
  .get((request, response) => {
    response
    .status(200)
    .json(modelList)
  })

  router.all('/:model/:id?', (request, response, next) => {
    let name = request.params['model']
    if (modelList.indexOf(name) === -1) {
      return response
      .status(404)
      .json({
        msg: `No model ${name} found`,
        success: false
      })
    }
    next()
  })

  router.route('/:model')
  .get((request, response) => { // list of documents for this model
    let name = request.params['model']
    console.log(name)
    model[name].find({}).exec()
    .then((objList) => {
      response
      .status(200)
      .contentType('application/json')
      .set('Access-Control-Allow-Origin', '*')
      .json(objList)
    })
    .catch(err => {
      model.logger.error(err)
      response.status(404).send(err)
    })
  })
  .post((request, response) => { // save a document
    let name = request.params['model']
    let obj = new model[name](request.body)

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
    .catch(err => {
      model.logger.error(err)
      response.status(403).send(err)
    })
  })

  router.route('/:model/:id')
  .get((request, response) => { // get a specific document
    let name = request.params['model']
    let id = request.params['id']

    model[name].findById(id).exec()
    .then((obj) => {
      response
      .status(200)
      .contentType('application/json')
      .set('Access-Control-Allow-Origin', '*')
      .json(obj)
    })
    .catch(err => {
      model.logger.error(err)
      response.status(404).send(err)
    })
  })
  .put((request, response) => { // update the model
    let name = request.params['model']
    let id = request.params['id']
    let updatedObj = request.body // accepts only json

    // update the obj in the database
    model[name].findById(id).exec()
    .then((obj) => {
      // update object
      for (let prop in updatedObj) {
        obj[prop] = updatedObj[prop]
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
      .catch(err => {
        model.logger.error(err)
        response.status(500).send(err)
      })
    })
    .catch(err => {
      model.logger.error(err)
      response.status(404).send(err)
    })
  })
  .delete((request, response) => { // delete the model
    let name = request.params['model']
    let id = request.params['id']

    model[name].remove({ '_id': id })
    .then(() => response.status(204).send())
    .catch(err => {
      model.logger.error(err)
      response.status(500).send(err)
    })
  })

  return router
}
