/**
 * Utility function on the models
 */
import {Stock} from './model.d.ts'
import {Order} from './order'

/**
 * Determine if the stock state has all the stock in the stock list given
 * @param  {Object}       stockState the stock state
 * @param  {Array<Stock>} stockList  a list of stocks from an order
 * @return {boolean}                 if the stock state contains the stocks
 */
export function hasEnoughStock (stockState: Object,
stockList: Array<Stock>): boolean {
  for (let stock of stockList) {
    let key = `${stock.categoryId}_${stock.unitPrice}`
    if (! stockState[key] || (stockState[key] - stock.quantity < 0)) {
      return false
    }
  }
  return true
}

/**
 * Determine the stock of a place at a given date
 * @param  {number}          placeId the id of the place
 * @param  {Date}            date    the date when we want the stock state
 * @return {Promise<Object>}         the stock state
 */
export async function getStockState (placeId: number,
date?: Date): Promise<Object> {
  let stockState: Object = {}
  if (! date) { date = new Date() }

  // input first
  try {
    let orderList = await Order.find({
      date: { $lt: date },
      placeIdDestination: placeId
    }).exec()

    for (let currOrder of orderList) {
      for (let stock of currOrder.get('stock')) {
        let key = `${stock.get('categoryId')}_${stock.get('unitPrice')}`
        if (stockState[key] !== undefined) {
          stockState[key] += stock.get('quantity')
        } else {
          stockState[key] = stock.get('quantity')
        }
      }
    }
  } catch (err) {
    throw err
  }

  // output then
  try {
    let orderList = await Order.find({
      date: { $lt: date },
      placeIdSource: placeId
    }).exec()

    for (let currOrder of orderList) {
      for (let stock of currOrder.get('stock')) {
        let key = `${stock.get('categoryId')}_${stock.get('unitPrice')}`
        if (stockState[key] !== undefined) {
          stockState[key] -= stock.get('quantity')
        } else {
          stockState[key] = -stock.get('quantity')
        }
      }
    }
  } catch (err) {
    throw err
  }

  return stockState
}

// TODO function to get stockState for a category
