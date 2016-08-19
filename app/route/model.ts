import {DatabaseObject} from '../type/model.d.ts'
import {Router, Request, Response, NextFunction} from 'express'
import {handle500} from './error'

export function getModelRoutes(model: DatabaseObject): Router {
  let router = Router()

  let modelList: Array<string> = Object.keys(model).filter((e) => {
    return (e !== 'connection' && e !== 'logger' && e !== 'tokenSalt')
  })

  router.route('/') // list of models available
  .get((req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(modelList)
  })

  // param middleware to get the name of the model or 404 error
  router.param('model', (req, res, next, modelName) => {
    if (modelList.indexOf(modelName) === -1) {
      return res.status(404).json({
        message: `No model ${modelName} found`,
        success: false
      })
    }
    req['modelName'] = modelName
    next()
  })

  // param middleware to retrieve the document
  router.param('id', (req, res, next, id) => {
    model[req['modelName']].findById(id).exec()
    .then((obj) => {
      if (!obj) {
        return res.status(404).json({
          message: `No corresponding document found in ${req['modelName']}`,
          success: false
        })
      }
      req['model'] = obj
      next()
    })
    .catch((err) => {
      model.logger.error(err)
      handle500(res, err)
    })
  })

  // request handlers for get and post
  router.route('/:model')
  .get((req: Request, res: Response, next: NextFunction) => { // list documents
    model[req['modelName']].find({}).exec()
    .then((objList) => {
      res.status(200).contentType('application/json').json(objList)
    })
    .catch(err => {
      model.logger.error(err)
      return handle500(res, err)
    })
  })
  .post((req: Request, res: Response, next: NextFunction) => { // create
    let obj = new model[req['modelName']](req['body'])
    obj.save()
    .then((dbObj) => {
      let uri = `http://${req.headers['host']}/${req['modelName']}/${dbObj._id}`
      model.logger.info(`create: ${dbObj}`)
      return res.status(201)
      .location(uri)
      .json(dbObj)
    })
    .catch(err => {
      model.logger.error(err)
      return handle500(res, err)
    })
  })

  // request handlers for get, put, patch and delete
  router.route('/:model/:id')
  .get((req: Request, res: Response, next: NextFunction) => {
    res.status(200).contentType('application/json').json(req['model'])
  })
  .patch((req: Request, res: Response, next: NextFunction) => { // update
    let updatedObj = req['body'] // accepts only json
    // update object
    for (let prop in updatedObj) {
      req['model'][prop] = updatedObj[prop]
    }

    // save the new object in the database and send it in the response
    req['model'].save()
    .then((newObj) => {
      model.logger.info(`update: ${newObj}`)
      res.status(200).contentType('application/json').json(newObj)
    })
    .catch(err => {
      model.logger.error(err)
      return handle500(res, err)
    })
  })
  .put((req: Request, res: Response, next: NextFunction) => { // update
    let updatedObj = req['body'] // accepts only json
    // update object
    updatedObj._id = req['model']._id

    // save the new object in the database and send it in the response
    updatedObj.save()
    .then((newObj) => {
      model.logger.info(`update: ${newObj}`)
      res.status(200).contentType('application/json').json(newObj)
    })
    .catch(err => {
      model.logger.error(err)
      return handle500(res, err)
    })
  })
  .delete((req: Request, res: Response, next: NextFunction) => { // delete
    req['model'].remove().exec()
    .then(() => {
      model.logger.info(`remove: ${req['model']}`)
      return res.status(200).json(req['model'])
    })
    .catch(err => {
      model.logger.error(err)
      return handle500(res, err)
    })
  })

  return router
}
