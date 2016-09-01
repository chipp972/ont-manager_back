import {DatabaseObject, Category} from '../..//type/model.d.ts'
import * as chai from 'chai'

let category1 = {
  name: 'cable'
}

let category2 = {
  name: 'ont'
}

let category3 = {
  name: 'switch'
}

export function categoryTests (): any {
//   describe('Category model', () => {

}
//
//     beforeEach(function (done: MochaDone): void  {
//       database.category.remove({}).exec()
//       .then(() => done(),
//       (err) => done(err))
//     })
//
//     it('should add categories', (done) => {
//       database.category.remove({}).exec()
//       .then(() => {
//         database.category.create(categoryMock1)
//         .then((obj) => {
//           categoryMock2.upperCategoryId = obj._id
//           categoryMock3.upperCategoryId = obj._id
//           let p1 = database.category.create(categoryMock2)
//           let p2 = database.category.create(categoryMock3)
//
//           Promise.all([p1, p2])
//           .then(() => {
//             CategoryModel.find({}).exec()
//             .then((categories) => console.log(categories))
//             .then(() => done())
//           })
//         })
//       })
//     })
//
//     it('', (done) => {
//
//     })
//
//   })
// }
