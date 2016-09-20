/**
 * Calculate stock state
 */
import {Stock} from '../../type//model.d.ts'
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
   * get a stock state object in a more human readable way
   * @return {Promise<Array<any>>}
   */
  public async toObject (): Promise<Object> {
    try {
      this.state = this.state || await this.calculateStockState()
      let result = []
      let productList = await ProductModel.find({})
      .populate({
        path: 'fileId'
      }).exec()

      for (let prop in this.state) {
        let tmp = /(\d+)_(\d+)/.exec(prop)
        let id = Number(tmp[1])
        let price = Number(tmp[2])

        let item = productList.find((e) => { return Number(e._id) === id })
        result.push({
          code: item.code,
          file: item.fileId,
          itemDescription: item.description,
          productId: id,
          quantity: this.state[prop],
          unitPrice: price
        })
      }
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
   * Determine the stock of the place at a given date
   * @return {Promise<any>}         the stock state
   */
  private async calculateStockState (): Promise<any> {
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
      let inStockList = await StockModel.find({})
      .populate(populateQuery).exec()

      // then output
      populateQuery.populate.match.placeIdSource = this.placeId
      let outStockList = await StockModel.find({})
      .populate(populateQuery).exec()

      // create object
      for (let item of inStockList) {
        let key = `${item.get('productId')}_${item.get('unitPrice')}`
        if (this.state[key] !== undefined) {
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
