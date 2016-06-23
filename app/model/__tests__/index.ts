/**
 * Starts all database tests on operations
 */
import {DatabaseObject} from 'app/type/model.d.ts'
import {initDatabase} from '../index'
import {userTest} from './userTest'
import {categoryTest} from './categoryTest'
import {placeTest} from './placeTest'
import {orderTest} from './orderTest'

describe('Database Test', () => {

  let database: DatabaseObject

  // initialize the connection to the database for the tests
  before(function (done: MochaDone): void  {
    initDatabase('test')
    .then((obj) => database = obj)
    .catch((err) => { throw err })
    .then(() => done())
  })

  // model tests
  userTest(database)
  categoryTest(database)
  placeTest(database)
  orderTest(database)
})
