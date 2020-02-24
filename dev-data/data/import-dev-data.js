const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path: './config.env'})

const Tour = require('./../../models/tourModel')
const User = require('./../../models/userModel')
const Review = require('./../../models/reviewsModel.js')

const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PWD)

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('DB Connection Success'))

// Read the json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'))

// Import data to Mongo
const importData = async () => {
  try {
    await Tour.create(tours)
    await User.create(users, { validateBeforeSave: false})
    await Review.create(reviews)
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
    await User.deleteMany()
    await Review.deleteMany()
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
