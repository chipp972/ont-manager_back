import {authTests} from './auth'

describe('Route Test', () => {

  describe('Authentication Routes', () => {
    authTests()
  })

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
