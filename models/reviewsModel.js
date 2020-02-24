const mongoose = require('mongoose')
const Tour = require('./tourModel'
)
const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'You must enter a review text']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must belong to a tour']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  }
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Pour éviter qu'un user poste plusieurs reviews sur un meme tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true })

// MIDLEWARE
reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'user',
  //   select: 'name'
  // }).populate({
  //   path: 'tour',
  //   select: 'name photo'
  // })

  this.populate({
    path: 'user',
    select: 'name photo'
  })

  next()
})

reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: {tour: tourId}
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating'}
      }
    }
  ])
  
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRating
    })
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    })
  }

}

reviewSchema.post('save', function(){
  // This point to current review
  this.constructor.calcAverageRatings(this.tour)
})

reviewSchema.pre(/^findOneAnd/, async function(next) {
  // Permet d'executer la query et récupérer le doc à updater
  this.r = await this.findOne()
  console.log(this.r)
  next()
})

reviewSchema.post(/^findOneAnd/, async function(){
  await this.r.constructor.calcAverageRatings(this.r.tour)
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review