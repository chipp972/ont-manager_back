import {DatabaseObject, Category} from 'app/type/model.d.ts'
import {CategoryModel} from '../category'
import {expect} from 'chai'

let categoryMock1: Category = {
  _id: undefined,
  name: 'cable'
}

let categoryMock2: Category = {
  _id: undefined,
  name: 'cable 5m'
}

let categoryMock3: Category = {
  _id: undefined,
  name: 'cable 10m'
}

export function categoryTest (database: DatabaseObject): void {
  describe('Category model', () => {

    beforeEach(function (done: MochaDone): void  {
      database.category.remove({}).exec()
      .then(() => done(),
      (err) => done(err))
    })

    it('should add categories', (done) => {
      database.category.remove({}).exec()
      .then(() => {
        database.category.create(categoryMock1)
        .then((obj) => {
          categoryMock2.upperCategoryId = obj._id
          categoryMock3.upperCategoryId = obj._id
          let p1 = database.category.create(categoryMock2)
          let p2 = database.category.create(categoryMock3)

          Promise.all([p1, p2])
          .then(() => {
            CategoryModel.find({}).exec()
            .then((categories) => console.log(categories))
            .then(() => done())
          })
        })
      })
    })

    it('', (done) => {

    })

  })
}
