import * as mongoose from 'mongoose'
import {UserModel} from '../../model/user'
import {StockState} from '../stock_state'
import {sendMail} from './mail_sender'

/**
 * Check if any user has an alert on the stock state
 * @param  {mongoose.Document} order the order added to the collection
 * @return {Promise<void>}         when finished or reject errors
 */
export async function alertCheck (order: mongoose.Document): Promise<void> {
  try {
    let placeId = order.get('placeIdSource')
    let stockState = new StockState(placeId, order.get('date'))
    let userList = await UserModel.find({}).exec()
    for (let user of userList) {
      for (let alert of user.get('alertList')) {
        if (alert.placeId === placeId) {
          stockState.toObject(alert.categoryId)
          .then((obj) => {
            if (obj['TOTAL'] <= alert.threshold) {
              sendMail(user.get('email'))
            }
          })
          .catch(err => console.log(err))
        }
      }
    }
    return
  } catch (err) {
    throw err
  }
}
