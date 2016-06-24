import * as mongoose from 'mongoose'
import {UserModel} from '../../model/user'

/**
 * Check if any user has an alert on the stock state
 * @param  {mongoose.Document} order the order added to the collection
 * @return {Promise<Object>}         when finished or reject errors
 */
export async function alertCheck (order: mongoose.Document): Promise<Object> {
  try {
    // let placeId = order.get('placeIdSource')
    let userList = await UserModel.find({}).exec()
    for (let user of userList) {
      for (let alert of user.get('alertList')) {
        alert.get('placeId')
        /**
         * TODO finish alertCheck
         * and send mails to users
         */
      }
    }
    return
  } catch (err) {
    throw err
  }
}
