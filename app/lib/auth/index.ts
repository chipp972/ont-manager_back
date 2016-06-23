import {User} from 'app/type/model.d.ts'

import * as bcrypt from 'bcryptjs'

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
