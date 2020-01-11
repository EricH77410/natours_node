const express = require('express')
const app = express()
const morgan = require('morgan')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

// Route
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

// Middleware
if (process.env.NODE_ENV==='development') {
    app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.static(`${__dirname}/public`))

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    console.log(req.headers)
    next()
})

// Router
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// Bad route
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on the server`,404))
})

// Error handling
app.use(globalErrorHandler)

module.exports = app
