/**
 * Order model tests
 */
import {DatabaseObject} from '../../type/model.d.ts'
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
