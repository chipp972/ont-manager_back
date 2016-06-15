import * as mongoose from 'mongoose'
import * as bcrypt from 'bcryptjs'
import {RightSchema} from './right'

const SALT = 10

export let UserSchema = new mongoose.Schema({
  email: { index: { unique: true}, required: true, type: String },
  login: { index: { unique: true}, required: true, type: String },
  password: { required: true, type: String },
  right: RightSchema
})

UserSchema.pre('save', function (next: Function): void {
  let user = this

  // only hash the password if it has been modified or is new
  if (!user.isModified('password')) { return next() }

  bcrypt.genSalt(SALT, (err1, salt) => {
    if (err1) { return next(err1) }

    bcrypt.hash(user.password, salt, (err2, hash) => {
      if (err2) { return next(err2) }

      user.password = hash
      next()
    })
  })
})

UserSchema.method('comparePassword',
  function (candidate: string, callback: Function): any {
    bcrypt.compare(candidate, this.password, (err, isMatch) => {
      if (err) { return callback(err) }
      callback(undefined, isMatch)
    })
})

export let User = mongoose.model('User', UserSchema)
