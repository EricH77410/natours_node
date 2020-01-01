const mongoose = require('mongoose')
const slugify = require('slugify')
//const validator = require('validator')

const toursSchema = new mongoose.Schema({
  name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal 40 caract'],
      minlength: [10, 'A tour name must have a least 10 caract'],
      //validate: [validator.isAlpha, 'Tour name must only contain alpha']
  },
  slug: String,
  duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
      type: Number,
      required: [true, 'Tour must have a group size']
  },
  difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
          values: ['easy','medium','difficult'],
          message: 'Difficulty is either easy, medium or difficult'
      }
  },  
  price: {
      type: Number,
      required: [true, 'A tour must have price']
  },
  ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A Tour Rating must be above 1.0'],
      max: [5, 'A Tour Rating must be below 5.0']
  },
  ratingsQuantity: {
      type: Number,
      default: 0
  },
  priceDiscount: {
    type: Number,
    validate: { // custom validator, this pointe sur le NEW doc (pas sur update) 
        validator: function(val) {
            return val < this.price // evite que le discount soit plus grand que le prix
        },
        message: 'Discount should be below the price'
    }
  },
  summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary description']
  },
  description: {
      type: String,
      trim: true
  },
  imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
  },
  images: [String],
  createdAt: {
      type: Date,
      default: Date.now(),
      select: false
  },
  startDates: [Date],
  secretTour: {
      type: Boolean,
      default: false
  }
},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// Propriété virtuelle (non stocké dans la db)
toursSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7
})

// Midleware document avant save() et create() mais pas pour insertMany()
toursSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})

// toursSchema.pre('save', function(next) {
//     console.log('Will save document and netx()')
//     next()
// })

// toursSchema.post('save', function(doc,next) {
//     console.log(doc)
//     next()
// })


// QUERY MIDDLEWARE
toursSchema.pre(/^find/, function(next) {
    this.find({ secretTour: { $ne: true } })
    this.start = Date.now()
    next()
})

toursSchema.post(/^find/, function(docs, next) {
    console.log('Query :'+(Date.now() - this.start) + ' ms')
    //console.log(docs)
    next()
})

// Aggregation Middleware
toursSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({ $match: { secretTour: {$ne: true}} })
    console.log(this.pipeline())
    next()
})

const Tour = mongoose.model('Tour', toursSchema)

module.exports = Tour