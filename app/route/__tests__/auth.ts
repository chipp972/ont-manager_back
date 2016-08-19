import {DatabaseObject} from '../../type/model.d.ts'
import {initAppAndDatabase} from '../../app'
import * as request from 'supertest'
import * as chai from 'chai'

export let authTests = () => {
  let req: request.SuperTest<request.Test>
  let db: DatabaseObject
  let token: string

  // initialize the connection to the database for the tests
  before((done: MochaDone) => {
    initAppAndDatabase()
    .then((appPlusDb) => {
      db = appPlusDb.database
      req = request(appPlusDb.app)
      db.user.remove({}).exec()
      .then(() => {
        done()
      }, (err) => {
        console.log(err)
        return done(err)
      })
    })
    .catch(err => {
      console.log(err)
      return done(err)
    })
  })

  after(() => {
    db.connection.close()
  })

  describe('Register & Signin', () => {

    it('should fail to access the page', (done: MochaDone) => {
      req.get('/model')
      .end((err, res) => {
        if (err) {
          console.log(err)
          return done(err)
        }
        chai.expect(res.text).to.equal('Unauthorized')
        chai.expect(res.status).to.equal(401)
        done()
      })
    })

    it('should create a user', (done: MochaDone) => {
      req.post('/register')
      .send({
        email: 'root@covage.com',
        password: 'a'
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) {
          console.log(err)
          return done(err)
        }
        chai.expect(res.body.email).to.equal('root@covage.com')
        chai.expect(res.body.password).to.be.a('string')
        .with.length.greaterThan(10)
        chai.expect(res.body.activated).to.equal(false)
        chai.expect(res.body.admin).to.equal(false)

        // activate user to login
          db.user.findByIdAndUpdate(res.body._id, {
          $set: { 'activated': true }
        }, (err2) => {
          if (err2) {
            console.log(err2)
            return done(err2)
          }
          done()
        })
      })
    })

    it('should get a token for the created user', (done: MochaDone) => {
      req.post('/signin')
      .send({
        email: 'root@covage.com',
        password: 'a'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) {
          console.log(err)
          return done(err)
        }
        chai.expect(res.body.success).to.equal(true)
        chai.expect(res.body.token).to.be.a('string')
        .with.length.greaterThan(10)
        token = res.body.token
        done()
      })
    })

    it('should succeed to access the page', (done: MochaDone) => {
      req.get('/model')
      .set('token', token)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) {
          console.log(err)
          return done(err)
        }
        console.log(res.body)
        // chai.expect(Object.keys(db)).to.include(res.body)
        done()
      })
    })

  })
}
