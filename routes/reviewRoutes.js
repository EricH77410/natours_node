const express = require('express')

const reviewController = require('../controllers/reviewController')
const authcontroller = require('../controllers/authController')

const router = express.Router({ mergeParams: true })

// Il faudra etre authentifié pour les routes ci dessous
router.use(authcontroller.protect)

router.route('/')
  .get(reviewController.getAllReviews)
  .post(authcontroller.protect,
    authcontroller.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  )

  router.route('/:id')
    .delete(authcontroller.restrictTo('user','admin'),reviewController.deleteReview)
    .patch(authcontroller.restrictTo('user','admin'), reviewController.updateReview)
    .get(reviewController.getReview)

  module.exports = router