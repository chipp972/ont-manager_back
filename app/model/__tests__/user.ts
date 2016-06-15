import {initServer} from 'app/server'
import * as request from 'supertest-as-promised'

let req: request.SuperTest

let mock = {
  login: 'atik3',
  password: 'huhuhu',
  right: {
    add: true,
    modify: true,
    view: true
  }
}

// let curr = new User({
//   login: 'nico2',
//   password: 'hohioha',
//   right: {
//     add: true, modify: true, view: true
//   }
// })
// curr.save((err, obj) => {
//   if (err) { console.log(err) }
//   if (obj) { console.log(obj) }
// })
// User
// .findOne({ login: 'atik2' })
// .populate('user.right')
// .exec(
//   (err, obj) => {
//     if (err) { console.log(err) }
//     if (obj) { console.log(obj) }
// })

describe('Test HTTP API for User Model', () => {
  before(function (done: MochaDone): void  {
    initServer('test', 'test')
    .then((server) => req = request(server))
    .catch((err) => { throw err })
    .then(() => done())
  })
  describe('Post user', () => {
    it('should post a user', () => {
      req
      .post('/user')
      .send(mock)
      .expect(201)
      .then((res: request.Response) => {
        // expect(res.body).to.equal(['dsp', 'equipment', 'order', 'user'])
        console.log(res)
      })
    })
  })
  describe('Get user', () => {
    it('should get the list of users', () => {
      req
      .get('/user')
      .expect(200)
      .then((res: request.Response) => {
        // expect(res.body).to.equal(['dsp', 'equipment', 'order', 'user'])
        // console.log(res.body)
      })
    })
    it('should get a user', () => {
      req
      .get('/user/575e8acd7070d21c16be51b8')
      .expect(200)
      .then((res: request.Response) => {
        // expect(res.body).to.equal(['dsp', 'equipment', 'order', 'user'])
        console.log(res.body)
      })
    })
  })
})
