import {DatabaseObject} from '../type/model.d.ts'
import {Router} from 'express'
import * as jwt from 'jsonwebtoken'
import * as passport from 'passport'

export function getAuthenticationRoutes(model: DatabaseObject): Router {
  let router = Router()

  // route to add new accounts (not activated)
  router.post('/register', (request, response) => {
    let newUser = new model.user({
      email: request.body.email,
      password: request.body.password
    })
    newUser.save()
    .then((user) => {
      response.status(201).json(user)
    }, (err) => {
      model.logger.error(err)
      response.status(500).send(err)
    })
  })

  /**
   * Check name and password against the database and provide a
   * token if authentication succeeded.
   */
  router.post('/signin', (request, response) => {
    model.user.findOne({ email: request.body.email }).exec()
    .then((account) => {
      if (!account) {
        response
        .status(404)
        .json({
          msg: 'User not found.',
          success: false
        })
      } else {
        if (account.activated === false) {
          return response.status(403).json({
            msg: 'Account not activated',
            success: false
          })
        }
        account.comparePassword(request.body.password, (err, isMatch) => {
          if (isMatch && !err) {
            let opts: jwt.SignOptions = {}
            opts.expiresIn = '1h'
            let token = jwt.sign(account, model.tokenSalt, opts)
            // send token
            response.status(200).json({ success: true, token: token })
          } else {
            response
            .status(404)
            .json({
              msg: 'Authentication failed. Wrong password.',
              success: false
            })
          }
        })
      }
    })
  })

  // middleware to authenticate requests for other routes
  router.use(passport.authenticate('jwt', { session: false}),
    (request, response, next) => {
      next()
    }
  )

  return router
}
