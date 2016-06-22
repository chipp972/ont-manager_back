import * as bcrypt from 'bcryptjs'
import {User} from 'app/model/model.d.ts'

export function comparePassword (pass: string, user: User): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    bcrypt.compare(pass, user.password, (err, isMatching) => {
      if (isMatching) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}
