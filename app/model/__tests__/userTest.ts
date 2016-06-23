/**
 * User model tests
 */
import {DatabaseObject} from 'app/type/model.d.ts'
import {expect} from 'chai'

let userMock = {
  mail: 'user.test@email.com',
  password: 'secret123'
}

export function userTest (database: DatabaseObject): void {
  describe('User model', () => {
    it('should add an user', (done) => {
      database.user.remove({}).exec()
      .then(() => {
        let newUser = new database.user(userMock)
        newUser.save((err) => {
          console.log(err)
          database.user.findOne({ mail: userMock.mail }).exec()
          .then(result => {
            console.log('haha')
            console.log(result.toObject())
            expect(result.toObject()).to.deep.equal(userMock)
          })
          .then(() => done())
        })
      })
    })
  })
}
