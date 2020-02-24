const Tour = require('../models/tourModel')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1 - get all the tour data from collection
  const tours = await Tour.find()

  // 2 - Build the template
  // 3 - Render the template with data
  res.status(200)
      .render('overview', {
          title: 'All Tours',
          tours
      })
})

exports.getTour = catchAsync(async (req, res, next) => {
    // 1 get the data for the tour (including review and tour guides)
    const tour = await Tour.findOne({slug: req.params.slug}).populate({ 
        path: 'reviews',
        fields: 'review rating user' 
    })

    if(!tour) {
        return next(new AppError('There is no tour with that name',404))
    }
    
  res.status(200)
      .render('tour', {
          tour,
          title: tour.name
      })
})

exports.getLoginForm = (req, res) => {
    res.status(200)
        .render('login', {
            title: 'Log into your account'
        })
}

exports.getMe = (req, res) => {
    res.status(200)
        .render('account',{
            title: 'Your account'
        })
}

exports.updateUserData =catchAsync(async (req, res, next) => {
    const updUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    },{
        new: true,
        runValidators: true
    })

    res.status(200)
        .render('account',{
            title: 'Your account',
            user: updUser
        })
})