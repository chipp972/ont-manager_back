import {DatabaseObject} from '../../type/model.d.ts'
import * as request from 'supertest'
// import * as chai from 'chai'
import {authTests} from './auth'

describe('Route Test', () => {

  describe ('Routes', () => {

    describe('Authentication Routes', () => {
      authTests()
    })
  })

  // describe('Register & Signin', () => {
  //   it('should create a user', (done: MochaDone) => {
  //     req
  //     .post('/register')
  //     .send({
  //       email: 'root@covage.com',
  //       password: 'a'
  //     })
  //     .expect(201)
  //     .expect('Content-Type', /json/)
  //     .end((err, res) => {
  //       if (err) { done(err) }
  //       chai.expect(res.body.email).to.equal('root@covage.com')
  //       chai.expect(res.body.password).to.be.a('string')
  //       .with.length.greaterThan(10)
  //       chai.expect(res.body.activated).to.equal(false)
  //       chai.expect(res.body.admin).to.equal(false)
  //
  //       // activate user to login
  //       appPlusDb.database.user.findByIdAndUpdate(res.body._id, {
  //         $set: { 'activated': true }
  //       }, function (err2: any): any {
  //         if (err2) { done(err2) }
  //         done()
  //       })
  //     })
  //   })
  //
  //   it('should get a token for the created user', (done: MochaDone) => {
  //     req
  //     .post('/signin')
  //     .send({
  //       email: 'root@covage.com',
  //       password: 'a'
  //     })
  //     .expect(200)
  //     .expect('Content-Type', /json/)
  //     .end((err, res) => {
  //       if (err) { done(err) }
  //       chai.expect(res.body.success).to.equal(true)
  //       chai.expect(res.body.token).to.be.a('string')
  //       .with.length.greaterThan(10)
  //       done()
  //     })
  //   })
  // })

  // describe('Get user', () => {
  //   it('should get all users', (done: MochaDone) => {
  //     req
  //     .get('/model/user')
  //     .expect(200)
  //     .expect('Content-Type', /json/)
  //     .end((err, res) => {
  //       if (err) { done(err) }
  //       console.log(res.body)
  //
  //       done()
  //     })
  //   })
  // })

  // test unauthorized route
  // console.log(res.unauthorized)

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
