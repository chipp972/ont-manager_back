/**
 * Calculate stock state
 */
import {Stock} from '../../type//model.d.ts'
import {OrderModel} from '../../model/order'
import {ProductCodeModel} from '../../model/product_code'
import {DeliveryModel} from '../../model/delivery'

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
   * get a stock state object in a more human readable state with code
   * names, unit prices for each code and quantity for each unit price
   * @param  {number}          [codeId] limit the result to a code
   * @return {Promise<Object>}              the new stock state
   */
  public async toObject (codeId?: number): Promise<Object> {
    try {
      this.state = this.state || await this.calculateStockState()
      let result: Object = {}
      let codeList: Array<number> = undefined

      for (let prop in this.state) {
        let tmp = /(\d+)_(\d+)/.exec(prop)
        let id = tmp[1]
        let price = tmp[2]

        if (! codeList ||
        (codeList && codeList.indexOf(Number(id)) !== -1)) {

          let code = await ProductCodeModel.findOne({ _id: id }).exec()
          let codeName = code.get('description')
          result[codeName] = result[codeName] || {}
          result[codeName][price] = this.state[prop]
        }
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
      let key = `${stock.codeId}_${stock.unitPrice}`
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

      let deliveryList = await DeliveryModel.find({
        date: { $lt: this.date },
        placeIdDestination: this.placeId
      })
      .populate({
        match: { placeIdDestination: this.placeId },
        path: 'orderId'
      }).exec()
      deliveryList = deliveryList.filter((e) => {
        return e['orderId'] !== undefined
      })

      console.log(deliveryList)

    //   for (let currOrder of orderList) {
    //     for (let stock of currOrder.get('receivedStock')) {
    //       let key = `${stock.get('codeId')}_${stock.get('unitPrice')}`
    //       if (stockState[key] !== undefined) {
    //         stockState[key] += stock.get('quantity')
    //       } else {
    //         stockState[key] = stock.get('quantity')
    //       }
    //     }
    //   }
    // } catch (err) {
    //   throw err
    // }
    //
    // // output then
    // try {
    //   let orderList = await OrderModel.find({
    //     date: { $lt: this.date },
    //     placeIdSource: this.placeId
    //   }).exec()
    //
    //   for (let currOrder of orderList) {
    //     for (let stock of currOrder.get('receivedStock')) {
    //       let key = `${stock.get('codeId')}_${stock.get('unitPrice')}`
    //       if (stockState[key] !== undefined) {
    //         stockState[key] -= stock.get('quantity')
    //       } else {
    //         stockState[key] = -stock.get('quantity')
    //       }
    //     }
    //   }
    } catch (err) {
      throw err
    }

    return stockState
  }
}
