const express = require('express')
const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController')



const router = express.Router()

router.get('/me', authController.protect, userController.getMe, userController.getOneUser)

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

// Toutes les routes en dessous seront protégés
router.use(authController.protect)

router.patch('/updateMyPassword', authController.updatePassword)

router.patch(
  '/updateMe', 
  userController.uploadUserPhoto, 
  userController.resizeUserPhoto, 
  userController.updateMe
  )

router.delete('/deleteMe', userController.deleteMe)

// Il faudra etre admin pour les routes en dessous
router.use(authController.restrictTo('admin'))
router.route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser)

router.route('/:id')
  .get(userController.getOneUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)


module.exports = router