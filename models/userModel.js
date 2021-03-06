const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

// name, email, photo, password, passwordConfirm

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please give a name to create a user'],    
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['user','guide','lead-guide','admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // Ne fonctionne que sur le creation  et save du document!
      validator: function(el) {
        return el === this.password
      },
      message: 'Passwords are not the same'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
})

usersSchema.pre('save', async function(next) {
  // Only run if password was modified
  if (!this.isModified('password')) return next()

  // hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12)

  // delete the passwordConfirm
  this.passwordConfirm = undefined
  next() 
})

usersSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next()

  this.passwordChangedAt = Date.now() - 1000
  next()
})

usersSchema.pre(/^find/, function(next) {
  // This point to the current query
  this.find({ active: {$ne: false} })
  next()
})

usersSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

usersSchema.methods.changedPasswordAfter = function(JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    //console.log(this.passwordChangedAt, JWTTimeStamp)

    return JWTTimeStamp < changedTimestamp
  }
  
  return false
}

usersSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex')

  this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex')
  this.passwordResetExpires = Date.now()+10 * 60 * 1000
  
  return resetToken
}

const User = mongoose.model('User', usersSchema)

module.exports = User