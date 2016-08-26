import {DatabaseObject} from '../type/model.d.ts'
import {Router, Request, Response, NextFunction} from 'express'
import * as jwt from 'jsonwebtoken'
import * as passport from 'passport'

export function getAuthenticationRoutes(model: DatabaseObject): Router {
  let router = Router()

  // route to add new accounts (not activated)
  router.route('/register')
  .post((req: Request, res: Response, next: NextFunction) => {
    let newUser = new model.user({
      email: req['body'].email,
      password: req['body'].password
    })
    newUser.save()
    .then((account) => {
      model.logger.info(`create: ${account}`)
      res.status(201).json(account)
    }, (err) => {
      model.logger.error(err)
      return next(err)
    })
  })

  /**
   * Check name and password against the database and provide a
   * token if authentication succeeded.
   */
  router.route('/signin')
  .post((req: Request, res: Response, next: NextFunction) => {
    model.user.findOne({ email: req['body'].email }).exec()
    .then((account) => {
      if (!account) { return next() }
      if (!account.activated) {
        return res.status(403).json({
          message: 'Account not activated',
          success: false
        })
      }
<<<<<<< HEAD
      account.comparePassword(req['body'].password, (err, isMatch) => {
        if (err) { return next(err) }
=======
      account.comparePassword(req['body'].password)
      .then((isMatch) => {
>>>>>>> 3011354d1c506354f0557147a571a12ba8813bad
        if (!isMatch) { return next() }
        let opts: jwt.SignOptions = { expiresIn: '1h' }
        let token = jwt.sign(account, model.tokenSalt, opts)
        return res.status(200).json({
          success: true,
          token: token
        })
      })
      .catch(err => {
        model.logger.error(err)
        return handle500(res, err)
      })
    }, (err) => {
      model.logger.error(err)
      return next(err)
    })
  })
  .post((req: Request, res: Response, next: NextFunction) => {
    return res.status(401).json({
      message: 'Authentication failed',
      success: false
    })
  })

  // middleware to authenticate reqs for other routes
  router.use(passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response, next: NextFunction) => {
    next()
  })

  return router
}
