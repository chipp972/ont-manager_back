import {DatabaseObject} from '../../type/model.d.ts'
import {initDatabase} from '../index'
// import {userTest} from './userTest'
import {categoryTests} from './category'
// import {placeTest} from './placeTest'
// import {orderTest} from './orderTest'

// let database: DatabaseObject

describe('Database Test', () => {

  categoryTests()

})
//
//   // initialize the connection to the database for the tests
//   // beforeEach(function (done: MochaDone): void  {
//   //   initDatabase('test')
//   //   .then((obj) => database = obj)
//   //   .catch(err => done(err))
//   //   .then(() => done())
//   // })
//   //
//   // after(function (done: MochaDone): void  {
//   //   database.connection.close()
//   //   done()
//   // })
//
//   it('Model Tests', (done: MochaDone) => {
//     initDatabase('test')
//     .then((database) => {
//       userTest(database)
//       categoryTest(database)
//       placeTest(database)
//       orderTest(database)
//       done()
//     })
//     // .then(() => database.connection.close())
//   })
// })
