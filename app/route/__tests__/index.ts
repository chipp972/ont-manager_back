import {AppPlusDatabase} from '../../type/config.d.ts'
import * as request from 'supertest'
import {initAppAndDatabase} from '../../app'
import * as chai from 'chai'

describe('Model Route Test', () => {

  let req: request.SuperTest<request.Test>
  let appPlusDb: AppPlusDatabase

  // initialize the connection to the database for the tests
  before(() =>  {
    return initAppAndDatabase()
    .then((obj) => {
      req = request(obj.app)
      appPlusDb = obj
      return appPlusDb.database.user.remove({}).exec()
    })
    .catch((err) => { throw err })
  })

  after(() => {
    appPlusDb.database.connection.close()
  })

  describe('Register', () => {
    it('should create a user', (done: MochaDone) => {
      req
      .post('/register')
      .field('email', 'root@covage.com')
      .field('password', 'haha')
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err) }
        console.log(res.unauthorized)
        // chai.expect(res.body.email).to.equal('root@covage.com')
        // chai.expect(res.body.password).to.be.a('string')
        // .with.length.greaterThan(10)
        // chai.expect(res.body.activated).to.equal(false)
        // chai.expect(res.body.admin).to.equal(false)
        done()
      })
    })
  })

  describe('Get user', () => {
    it('should get all users', (done: MochaDone) => {
      req
      .get('/model/user')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err) }
        console.log(res.body)

        done()
      })
    })
  })

  //   describe('Get user', () => {
  //     it('should get the list of users', () => {
  //       req
  //       .get('/user')
  //       .expect(200)
  //       .then((res: request.Response) => {
  //         // expect(res.body).to.equal(['dsp', 'equipment', 'order', 'user'])
  //         // console.log(res.body)
  //       })
  //     })
  //     it('should get a user', () => {
  //       req
  //       .get('/user/575e8acd7070d21c16be51b8')
  //       .expect(200)
  //       .then((res: request.Response) => {
  //         // expect(res.body).to.equal(['dsp', 'equipment', 'order', 'user'])
  //         console.log(res.body)
  //       })
  //     })
  //   })

})
