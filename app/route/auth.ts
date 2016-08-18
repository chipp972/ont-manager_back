import {DatabaseObject} from '../type/model.d.ts'
import {Router, Request, Response, NextFunction} from 'express'
import * as jwt from 'jsonwebtoken'
import * as passport from 'passport'
import {handle500} from './error'

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
    .then((user) => {
      model.logger.info(`create: ${user}`)
      res.status(201).json(user)
    }, (err) => {
      model.logger.error(err)
      return handle500(res, err)
    })
  })

  /**
   * Check name and password against the database and provide a
   * token if authentication succeeded.
   */
  router.post('/signin', (req: Request, res: Response, next: NextFunction) => {
    model.user.findOne({ email: req['body'].email }).exec()
    .then((account) => {
      if (!account) { return next() }
      if (!account.activated) {
        return res.status(403).json({
          message: 'Account not activated',
          success: false
        })
      }
      account.comparePassword(req['body'].password, (err, isMatch) => {
        if (!isMatch || err) {
          res.status(401).json({
            message: 'Authentication failed',
            success: false
          })
        }
        let opts: jwt.SignOptions = {}
        opts.expiresIn = '1h'

        let token = jwt.sign(account, model.tokenSalt, opts)
        return res.status(200).json({ success: true, token: token })
      })
    }, (err) => {
      model.logger.error(err)
      return handle500(res, err)
    })
  })

  // middleware to authenticate reqs for other routes
  router.use(passport.authenticate('jwt', { session: false }),
    (req: Request, res: Response, next: NextFunction) => {
      next()
    }
  )

  return router
}
