import {getMailConfig} from '../../config'
import {getTransport} from './transport'

/**
 * Send a mail to a user who subscribed to an alert on a specific stock
 * @param  {string}          email   the receiver of the mail
 * @param  {string}          subject
 * @param  {string}          message
 * @return {Promise<Object>}         when the mail is sent or en error occured
 */
export async function sendMail (email: string, subject: string, message: string)
: Promise<Object> {
  try {
    let transport = await getTransport()
    let config = await getMailConfig(process.env.NODE_ENV || 'development')

    let mailOptions = {
      from: config.dev_mail,
      subject: subject,
      text: message,
      to: email
    }

    return new Promise<Object>((resolve, reject) => {
      transport.sendMail(mailOptions, (err, info) => {
        if (err) { reject(err) }
        resolve(info)
      })
    })
  } catch (err) {
    throw err
  }
}
