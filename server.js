const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path: './config.env'})

// En cas de prbleme
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! shutting down...')
    console.log(err.name, err.message)
    process.exit(1) 
})

const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PWD)

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(() => console.log('DB Connection Success'))

const app = require('./app')

const port = process.env.PORT || 8080

const server = app.listen(port, () => {
    console.log('Server started on port: '+port)
})

// En cas de problemes, on plante l'app
process.on('unhandledRejection', err => {    
    console.log('UNHANDLED REJECTION! shutting down...')
    console.log('ERROR: ',err.name, err.message)
    server.close(() => {
        process.exit(1)
    })    
})
