/**
 * List of users of the application
 */
import {User} from '../type/model.d.ts'
import * as mongoose from 'mongoose'
import * as bcrypt from 'bcryptjs'
import * as autoIncr from 'mongoose-auto-increment'
import {AlertSchema} from './alert'
import {OrderModel} from './order'

const SALT = 10
const modelName = 'User'

export let UserSchema = new mongoose.Schema({
  activated: { default: false, type: Boolean },
  admin: { default: false, type: Boolean },
  alertList: [AlertSchema],
  email: {
    index: { unique: true},
    lowercase: true,
    required: true,
    trim: true,
    type: String
  },
  password: { required: true, type: String }
})

// Plugins
UserSchema.plugin(autoIncr.plugin, modelName)

// hooks
UserSchema.pre('save', function (next: Function): void {
  let user = this

  // only hash the password if it has been modified or is new
  if (user.isModified('password') || user.isNew) {
    bcrypt.genSalt(SALT, (err1, salt) => {
      if (err1) { return next(err1) }

      bcrypt.hash(user.password, salt, (err2, hash) => {
        if (err2) { return next(err2) }

        user.password = hash
        next()
      })
    })
  } else {
    next()
  }
})

// block delete if he is in some orders
UserSchema.pre('remove', function (next: Function): void {
  OrderModel.find({ userId: this._id }).exec()
  .then((documents) => {
    if (documents.length > 0) {
      next(new Error('This user is in some orders'))
    } else {
      next()
    }
  })
})

// methods
UserSchema.methods.comparePassword =
function (candidatePassword: string, cb: (e: Error, b: boolean) => any): any {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      return cb(err, false)
    }
    return cb(undefined, isMatch)
  })
}

export let UserModel = mongoose.model<User>(modelName, UserSchema)
