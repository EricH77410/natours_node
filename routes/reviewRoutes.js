const express = require('express')

const reviewController = require('../controllers/reviewController')
const authcontroller = require('../controllers/authController')

const router = express.Router()

router.route('/')
  .get(reviewController.getAllReviews)
  .post(authcontroller.protect,
    authcontroller.restrictTo('user'),
    reviewController.createReview
  )

  module.exports = router