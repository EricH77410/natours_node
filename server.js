const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path: './config.env'})

const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PWD)

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('DB Connection Success'))

const app = require('./app')

const port = process.env.PORT || 8080

app.listen(port, () => {
    console.log('Server started on port: '+port)
})