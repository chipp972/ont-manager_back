'use strict'
import {getMailConfig} from '../../config'
import {getLogger} from '../logger'
import * as nodemailer from 'nodemailer'
const mailGun = require('nodemailer-mailgun-transport')

/**
 * Create mail transporter for the application depending on the environment
 * @function module:mail#getTransport
 * @return {Promise<nodemailer.Transport>}
 */
export async function getTransport (): Promise<nodemailer.Transporter> {
  try {
    let config = await getMailConfig(process.env.NODE_ENV || 'development')
    let logger = getLogger(config.logfile)
    let transport = nodemailer.createTransport(mailGun({
      auth: {
        api_key: config.api_key,
        domain: config.domain
      },
      logger: logger
    }))
    return transport
  } catch (err) {
    throw err
  }
}

module.exports = getTransport
