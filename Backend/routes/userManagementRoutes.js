const express = require('express')
const router = express.Router()
const usersController = require('../controllers/userController')
const checkRole = require('../middleware/checkRole')



router.put('/change-password', checkRole('user','admin','manager'), usersController.changePassword)


router.get('/balance', checkRole('user') ,usersController.getBalance)

router.get('/all-users', checkRole('admin', 'manager') ,usersController.getAllUsers)
router.delete('/delete/:id', checkRole('admin', 'manager') ,usersController.deleteUser)

router.post('/create-admin', checkRole('admin'), usersController.createAdmin)

module.exports = router