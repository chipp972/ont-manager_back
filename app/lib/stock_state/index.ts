/**
 * Calculate stock state
 */
import {Stock, Place} from 'app/type//model.d.ts'
import {PlaceModel} from '../../model/place'
import {OrderModel} from '../../model/order'
import {CategoryModel} from '../../model/category'
import {getChildrenCategory} from './utils'

export class StockState {
  private placeId: number
  private date: Date
  private state: Object

  /**
   * @param  {number} placeId the id field of the place
   * @param  {Date}   [date]  the date at which we want the stock state
   */
  public constructor (placeId: number, date?: Date) {
    this.placeId = placeId
    this.date = date || new Date()
    this.state = undefined
  }

  /**
   * get a stock state object in a more human readable state with category
   * names, unit prices for each category and quantity for each unit price
   * @param  {number}          [categoryId] limit the result to a category
   *                                        and its children
   * @return {Promise<Object>}              the new stock state
   */
  public async toObject (categoryId?: number): Promise<Object> {
    try {
      this.state = this.state || await this.calculateStockState()
      let result: Object = {}
      let totalQuantity: number = undefined
      let categoryList: Array<number> = undefined

      if (categoryId) {
        categoryList = await getChildrenCategory(categoryId)
        totalQuantity = 0
      }

      for (let prop in this.state) {
        let tmp = /(\d+)_(\d+)/.exec(prop)
        let id = tmp[1]
        let price = tmp[2]

        if (! categoryList ||
        (categoryList && categoryList.indexOf(Number(id)) !== -1)) {

          let category = await CategoryModel.findOne({ _id: id }).exec()
          let categoryName = category.get('name')
          result[categoryName] = result[categoryName] || {}
          result[categoryName][price] = this.state[prop]

          if (categoryList) {
            totalQuantity += this.state[prop]
          }
        }
      }
      result['TOTAL'] = totalQuantity
      return result

    } catch (err) {
      throw err
    }
  }

  /**
   * Determine if the stock state has all the stock in the stock list given
   * @param  {Array<Stock>} stockList  a list of stocks from an order
   * @return {boolean}                 if the stock state contains the stocks
   */
  public async hasEnoughStock (stockList: Array<Stock>): Promise<boolean> {
    this.state = this.state || await this.calculateStockState()
    for (let stock of stockList) {
      let key = `${stock.categoryId}_${stock.unitPrice}`
      if (! this.state[key] || (this.state[key] - stock.quantity < 0)) {
        return false
      }
    }
    return true
  }

  public getDate (): Date {
    return this.date
  }

  public getPlaceId (): number {
    return this.placeId
  }

  /**
   * @return {Promise<Object>} the place object
   */
  public async getPlace (): Promise<Place> {
    try {
      let place = await PlaceModel.findOne({ _id: this.placeId }).exec()
      return place.toObject() as Place
    } catch (err) {
      throw err
    }
  }

  /**
   * Determine the stock of the place at a given date
   * @return {Promise<Object>}         the stock state
   */
  private async calculateStockState (): Promise<Object> {
    let stockState: Object = {}

    // input first
    try {
      let orderList = await OrderModel.find({
        date: { $lt: this.date },
        placeIdDestination: this.placeId
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
      let orderList = await OrderModel.find({
        date: { $lt: this.date },
        placeIdSource: this.placeId
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
}
