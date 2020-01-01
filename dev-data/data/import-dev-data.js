const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path: './config.env'})

const Tour = require('./../../models/tourModel')

const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PWD)

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('DB Connection Success'))

// Read the json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'))

// Import data to Mongo
const importData = async () => {
  try {
    await Tour.create(tours)
    console.log('data imported !')
    process.exit()
  } catch (err) {
    console.log(err)
  }
}

// Delete all existing data in collection
const deleteData = async () => {
  try {
    await Tour.deleteMany()
    console.log('data deleted !')
    process.exit()
  } catch (err) {
    console.log(err)
  }
}

if(process.argv[2] === "--import"){
  importData()
}

if (process.argv[2] === '--delete'){
  deleteData()
}

console.log(process.argv)
