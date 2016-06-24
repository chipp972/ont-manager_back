/**
 * Utility function to calculate stock state
 */
import {CategoryModel} from '../../model/category'

/**
 * Retrieve all subcategory of a category (including himself)
 * @param  {number}  categoryId the id of the parent category
 * @return {Promise}            an array of all category _id field
 */
export async function getChildrenCategory (categoryId: number):
Promise<Array<number>> {
  try {
    let result = [categoryId]

    for (let id of result) {
      let catList = await CategoryModel.find({ upperCategoryId: id }).exec()
      for (let category of catList) {
        let newId = category.get('_id')
        if (result.indexOf(newId) === -1) {
          result.push(newId)
        }
      }
    }
    return result
  } catch (err) {
    throw err
  }
}
