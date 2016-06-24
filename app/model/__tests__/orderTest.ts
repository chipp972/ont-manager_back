/**
 * Order model tests
 */
import {DatabaseObject} from 'app/type/model.d.ts'
import {expect} from 'chai'

let userMock = {
  mail: 'user.test@email.com',
  password: 'secret123'
}

let placeMockInternal = {
  name: 'place1'
}

let placeMockExternal = {
  internalStock: false,
  name: 'place2'
}

let categoryMock1 = {

}

export function orderTest (database: DatabaseObject): void {
  describe('Order model', () => {

    // initialize the test creating an user, 2 places and 2 categories
    before(function (done: MochaDone): void  {

      // .then(() => done())
    })

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

// let testd = `
// // order
// {
//   "reference": "DABHKA7648p71",
//   "placeIdSource":2,
//   "placeIdDestination": 0,
//   "userId": 0,
//   "stock": [
//     { "categoryId": 2, "quantity": 25, "unitPrice": 89 },
//     { "categoryId": 3, "quantity": 2, "unitPrice": 8 },
//     { "categoryId": 4, "quantity": 5, "unitPrice": 9 },
//     { "categoryId": 2, "quantity": 8, "unitPrice": 859 }
//   ]
// }
