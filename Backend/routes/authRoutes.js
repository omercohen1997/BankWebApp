const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const loginLimiter = require('../middleware/loginLimiter')

router.post('/signup', authController.signup)
router.post('/signup/verify-email', authController.verifyEmail)

router.post('/login', loginLimiter, authController.login)
//router.post('/login', authController.login)

router.post('/logout', authController.logout)

module.exports = router