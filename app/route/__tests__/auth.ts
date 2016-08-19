import {DatabaseObject} from '../../type/model.d.ts'
import {initAppAndDatabase} from '../../app'
import * as request from 'supertest'
import * as chai from 'chai'

export let authTests = function (): any {
  let req: request.SuperTest<request.Test>
  let db: DatabaseObject

  before('initialize app and fullfil variables', (done: MochaDone) =>  {
    initAppAndDatabase()
    .then((appPlusDb) => {
      db = appPlusDb.database
      req = request(appPlusDb.app)
      db.user.remove({}).exec()
      .then(() => {
        done()
      }, (err) => done(err))
    })
    .catch(err => done(err))
  })

  after('close database connection', () => {
    db.connection.close()
  })

  describe('Register & Signin', () => {
    // initialize the connection to the database for the tests

    it('should create a user', (done: MochaDone) => {
      req
      .post('/register')
      .send({
        email: 'root@covage.com',
        password: 'a'
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err) }
        chai.expect(res.body.email).to.equal('root@covage.com')
        chai.expect(res.body.password).to.be.a('string')
        .with.length.greaterThan(10)
        chai.expect(res.body.activated).to.equal(false)
        chai.expect(res.body.admin).to.equal(false)

        // activate user to login
          db.user.findByIdAndUpdate(res.body._id, {
          $set: { 'activated': true }
        }, function (err2: any): any {
          if (err2) { done(err2) }
          done()
        })
      })
    })

    it('should get a token for the created user', (done: MochaDone) => {
      req
      .post('/signin')
      .send({
        email: 'root@covage.com',
        password: 'a'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) { done(err) }
        chai.expect(res.body.success).to.equal(true)
        chai.expect(res.body.token).to.be.a('string')
        .with.length.greaterThan(10)
        done()
      })
    })
  })
}
