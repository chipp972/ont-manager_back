import {getMailConfig} from '../../config'
import * as nodemailer from 'nodemailer'

/**
 * Send a mail to a user who subscribed to an alert on a specific stock
 * @param  {string}          email the receiver of the mail
 * @return {Promise<Object>}       when the mail is sent or en error occured
 */
export async function sendMail (email: string): Promise<Object> {
  try {
    let config = await getMailConfig('mailsender')
    let transporter = nodemailer.createTransport
      (`smtps://${config.user}%40gmail.com:${config.password}@smtp.gmail.com`)

    let mailOptions = {
      from: `"Stockman" <${config.user}@gmail.com>`,
      subject: 'Alerte Stock',
      text: 'Alerte sur l\'etat du stock de ',
      to: email
    }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return err
      }
      console.log('Message sent: ' + info.response)
      return
    })

    return
  } catch (err) {
    throw err
  }
}
