const express = require('express')
const router = express.Router()
const usersController = require('../controllers/userController')


router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.signUp)

router.delete('/:id', usersController.deleteUser)
router.get('/:id/balance', usersController.getBalance)

router.post('/verify-email', usersController.verifyEmail);


module.exports = router