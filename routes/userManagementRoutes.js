const express = require('express')
const router = express.Router()
const usersController = require('../controllers/userController')
const verifyJWT = require('../middleware/verifyToken')
const checkRole = require('../middleware/checkRole')



// logged-in user  TODO:(Should the admin/manager count also as a noraml user?)
router.put('/change-password', verifyJWT, checkRole('user','admin','manager'), usersController.changePassword)


router.get('/balance', verifyJWT, checkRole('user','admin','manager') ,usersController.getBalance)

router.get('/all-users', verifyJWT, checkRole('admin', 'manager') ,usersController.getAllUsers)
router.delete('/delete/:id', verifyJWT, checkRole('admin', 'manager') ,usersController.deleteUser)


module.exports = router