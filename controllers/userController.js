const User = require('../models/userModel')
const ctahcAsynd = require('./../utils/catchAsync')

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()

  // Envoi de la réponse
  res.status(200).json({
  status: 'success',
  results: users.length,
  data: {
    users
  }
  })
})


exports.createUser = (req, res) => {
  res.status(500).json({
      status: 'error',
      message: 'This route is not yet define'
  })
}

exports.getOneUser = (req, res) => {
  res.status(500).json({
      status: 'error',
      message: 'This route is not yet define'
  })
}

exports.updateUser = (req, res) => {
  res.status(500).json({
      status: 'error',
      message: 'This route is not yet define'
  })
}

exports.deleteUser = (req, res) => {
  res.status(500).json({
      status: 'error',
      message: 'This route is not yet define'
  })
}
