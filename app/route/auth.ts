import {DatabaseObject} from '../type/model.d.ts'
import {Router, Request, Response, NextFunction} from 'express'
import * as jwt from 'jsonwebtoken'
import * as passport from 'passport'

export function getAuthenticationRoutes(model: DatabaseObject): Router {
  let router = Router()

  // route to add new accounts (not activated)
  router.route('/register')
  .post((req: Request, res: Response, next: NextFunction) => {
    // check if first user
    model.user.find({}).exec()
    .then((users) => {
      let newUser = {
        email: req['body'].email,
        password: req['body'].password,
        placeList: req['body'].placeList
      }
      if (users.length === 0) {
        newUser['activated'] = true
        newUser['admin'] = true
      }
      model.user.create(newUser, (err, user) => {
        if (err) {
          model.logger.error(err)
          next(err)
        }
        model.logger.info(`create: ${user}`)
        res.status(201).json(user)
      })
    }, (err) => {
      model.logger.error(err)
      next(err)
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
      account.comparePassword(req['body'].password)
      .then((isMatch) => {
        if (!isMatch) { return next() }
        let opts: jwt.SignOptions = { expiresIn: '1h' }
        let token = jwt.sign(account, model.tokenSalt, opts)
        return res.status(200).json({
          id: account._id,
          success: true,
          token: token
        })
      })
      .catch(err => {
        model.logger.error(err)
        return next(err)
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
