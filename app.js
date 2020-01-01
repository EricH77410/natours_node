const express = require('express')
const app = express()
const morgan = require('morgan')

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
    next()
})

// Router
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

module.exports = app
