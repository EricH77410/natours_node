const express = require('express')
const app = express()
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

// ==========
//    Routes
// ==========
const tourRouter    = require('./routes/tourRoutes')
const userRouter    = require('./routes/userRoutes')
const reviewRouter  = require('./routes/reviewRoutes')


// GLOBAL Middlewares

// Set Security http headers
app.use(helmet())

// dev log
if (process.env.NODE_ENV==='development') {
    app.use(morgan('dev'))
}

// Limit request from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requets from this IP, try again in an hour!' 
})

app.use('/api',limiter)

// Body parser, reading the body in req.body
app.use(express.json({ limit: '10kb' }))

// Sanitize client data against no sql injection
app.use(mongoSanitize())

// Data sanitization againt XSS
app.use(xss())

// Prevent parameter pollution
app.use(hpp({ 
    whitelist: [
        'duration', 
        'ratingQuantity', 
        'ratingsAverage', 
        'maxGroupSize',
        'difficulty', 
        'price']
 }))

// Serving static files
app.use(express.static(`${__dirname}/public`))

// test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    //console.log(req.headers)
    next()
})

// Router
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)

// Bad route
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on the server`,404))
})

// Error handling
app.use(globalErrorHandler)

module.exports = app
