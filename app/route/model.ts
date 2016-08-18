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

  router.route('/:model/:id?')
  .all((req: Request, res: Response, next: NextFunction) => {
    let name = req.params['model']
    if (modelList.indexOf(name) === -1) {
      return res.status(404).json({
        message: `No model ${name} found`,
        success: false
      })
    }
    next()
  })

  router.route('/:model')
  .get((req: Request, res: Response, next: NextFunction) => { // list documents
    let name = req.params['model']
    model[name].find({}).exec()
    .then((objList) => {
      res.status(200).contentType('application/json').json(objList)
    })
    .catch(err => {
      model.logger.error(err)
      return handle500(res, err)
    })
  })
  .post((req: Request, res: Response, next: NextFunction) => { // create
    let name = req.params['model']
    let obj = new model[name](req['body'])

    obj.save()
    .then((dbObj) => {
      let uri = `http://${req.headers['host']}/${name}/${dbObj.id}`
      model.logger.info(`create: ${dbObj}`)
      res.status(201).location(uri).contentType('application/json').json(dbObj)
    })
    .catch(err => {
      model.logger.error(err)
      return handle500(res, err)
    })
  })

  router.route('/:model/:id')
  .get((req: Request, res: Response, next: NextFunction) => {
    let name = req.params['model']
    let id = req.params['id']

    model[name].findById(id).exec()
    .then((obj) => {
      if (!obj) { return next() }
      res.status(200).contentType('application/json').json(obj)
    })
    .catch(err => {
      model.logger.error(err)
      return handle500(res, err)
    })
  })
  .patch((req: Request, res: Response, next: NextFunction) => { // update
    let name = req.params['model']
    let id = req.params['id']
    let updatedObj = req['body'] // accepts only json

    // update the obj in the database
    model[name].findById(id).exec()
    .then((obj) => {
      if (!obj) { return next() }
      // update object
      for (let prop in updatedObj) {
        obj[prop] = updatedObj[prop]
      }

      // save the new object in the database and send it in the response
      obj.save()
      .then((newObj) => {
        model.logger.info(`update: ${newObj}`)
        res.status(200).contentType('application/json').json(newObj)
      })
      .catch(err => {
        model.logger.error(err)
        return handle500(res, err)
      })
    })
    .catch(err => {
      model.logger.error(err)
      return handle500(res, err)
    })
  })
  .put((req: Request, res: Response, next: NextFunction) => { // update
    let name = req.params['model']
    let id = req.params['id']
    let updatedObj = req['body'] // accepts only json

    // update the obj in the database
    model[name].findById(id).exec()
    .then((obj) => {
      if (!obj) { return next() }
      // update object
      for (let prop in obj) {
        obj[prop] = updatedObj[prop]
      }

      // save the new object in the database and send it in the response
      obj.save()
      .then((newObj) => {
        model.logger.info(`update: ${newObj}`)
        return res.status(200).contentType('application/json').json(newObj)
      })
      .catch(err => {
        model.logger.error(err)
        return handle500(res, err)
      })
    })
    .catch(err => {
      model.logger.error(err)
      return handle500(res, err)
    })
  })
  .delete((req: Request, res: Response, next: NextFunction) => { // delete
    let name = req.params['model']
    let id = req.params['id']

    model[name].findByIdAndRemove(id).exec()
    .then((obj) => {
      model.logger.info(`remove: ${obj}`)
      return res.status(200).json(obj)
    })
    .catch(err => {
      model.logger.error(err)
      return handle500(res, err)
    })
  })

  return router
}
