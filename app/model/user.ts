/**
 * List of users of the application
 */
import {Schema, model} from 'mongoose'
import * as bcrypt from 'bcryptjs'
import * as autoIncr from 'mongoose-auto-increment'

const SALT = 10
const modelName = 'User'

export let UserSchema = new Schema({
  admin: { default: false, type: Boolean },
  email: {
    index: { unique: true},
    lowercase: true,
    required: true,
    trim: true,
    type: String
  },
  password: { required: true, type: String }
})

UserSchema.plugin(autoIncr.plugin, modelName)

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

export let User = model(modelName, UserSchema)
