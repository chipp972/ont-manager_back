/**
 * Calculate stock state
 */
import {Stock, StockStateObject} from '../../type//model.d.ts'
import {ProductModel} from '../../model/product'
import {StockModel} from '../../model/stock'

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
   * Determine if the stock state has all the stock in the stock list given
   * @param  {Array<Stock>} stockList  a list of stocks from an order
   * @return {boolean}                 if the stock state contains the stocks
   */
  public async hasEnoughStock (stockList: Array<Stock>): Promise<boolean> {
    this.state = this.state || await this.getStockState()
    for (let stock of stockList) {
      let key = `${stock.productId}_${stock.unitPrice}`
      if (!this.state[key] || (this.state[key] - stock.quantity < 0)) {
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
   * Return an array with all stocks from orders with state "sending"
   * @return {Promise<any>}
   */
  public async getWaitingStock (): Promise<any> {
    try {
      let result = {}
      let stockList = await StockModel.find({})
      .populate({
        match: {
          date: { $lt: this.date },
          state: 'sending'
        },
        path: 'orderId'
      }).exec()

      for (let item of stockList) {
        let key = `${item.get('productId')}_${item.get('unitPrice')}`
        if (result[key] !== undefined) {
          result[key] += item.get('quantity')
        } else {
          result[key] = item.get('quantity')
        }
      }
      return this.toObject(result)
    } catch (err) {
      throw err
    }
  }

  /**
   * get a stock state object in a more human readable way
   * @param {Object} state  keys = productId_unitPrice and values = quantity
   * @return {Promise<Array<any>>}
   */
  public async toObject (obj?: Object): Promise<Array<StockStateObject>> {
    try {
      if (!obj) { obj = this.state || await this.getStockState() }
      let result = []
      let productList = await ProductModel.find({})
      .populate({
        path: 'fileId'
      }).exec()

      for (let prop in obj) {
        let tmp = /(\d+)_(\d+)/.exec(prop)
        let id = Number(tmp[1])
        let price = Number(tmp[2])

        let item = productList.find((e) => { return Number(e._id) === id })
        result.push({
          code: item.code,
          file: item.fileId,
          itemDescription: item.description,
          productId: id,
          quantity: obj[prop],
          unitPrice: price
        })
      }
      return result
    } catch (err) {
      throw err
    }
  }

  /**
   * Determine the stock of the place at a given date
   * @return {Promise<any>}         the stock state
   */
  private async getStockState (): Promise<any> {
    // input first
    try {
      let populateQuery: any = {
        match: { date: { $lt: this.date } },
        path: 'deliveryId',
        populate: {
          match: {
            placeIdDestination: this.placeId
          },
          path: 'orderId'
        }
      }
      let inStockList = await StockModel.find({ deliveryId : { $ne: null } })
      .populate(populateQuery).exec()

      // then output
      populateQuery.populate.match.placeIdSource = this.placeId
      let outStockList = await StockModel.find({ deliveryId : { $ne: null } })
      .populate(populateQuery).exec()

      inStockList = inStockList
      .filter((e) => { return e.deliveryId != null })
      .filter((e) => { return e.deliveryId['orderId'] != null })

      outStockList = outStockList
      .filter((e) => { return e.deliveryId != null })
      .filter((e) => { return e.deliveryId['orderId'] != null })

      // create object
      for (let item of inStockList) {
        let key = `${item.get('productId')}_${item.get('unitPrice')}`
        if (this.state[key] !== null) {
          this.state[key] += item.get('quantity')
        } else {
          this.state[key] = item.get('quantity')
        }
      }

      for (let item of outStockList) {
        let key = `${item.get('productId')}_${item.get('unitPrice')}`
        if (this.state[key] !== undefined) {
          this.state[key] -= item.get('quantity')
        } else {
          this.state[key] = -item.get('quantity')
        }
      }
    } catch (err) {
      throw err
    }
    return this.state
  }
}
