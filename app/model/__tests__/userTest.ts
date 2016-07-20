/**
 * User model tests
 */
import {DatabaseObject, User} from 'app/type/model.d.ts'
import {expect} from 'chai'

let userMock: User = {
  _id: undefined,
  admin: false,
  email: 'user.test@email.com',
  password: 'secret123'
}

export function userTest (database: DatabaseObject): void {
  describe('User model', () => {
    it('should add an user', (done) => {
      database.user.remove({}).exec()
      .then(() => {
        database.user.create(userMock)
        .then((obj) => {
          database.user.findOne({ mail: userMock.email }).exec()
          .then(result => {
            expect(result.toObject()).to.deep.equal(userMock)
            done()
          })
        })
      })
    })
  })
}
