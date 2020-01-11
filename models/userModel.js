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
  photo: String,
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
  passwordChangedAt: Date
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

usersSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

usersSchema.methods.changedPasswordAfter = function(JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    console.log(this.passwordChangedAt, JWTTimeStamp)

    return JWTTimeStamp < changedTimestamp
  }
  
  return false
}

const User = mongoose.model('User', usersSchema)

module.exports = User