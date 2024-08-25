const express = require('express')
const router = express.Router()
const usersController = require('../controllers/userController')
const verifyJWT = require('../middleware/verifyToken')

//router.use(verifyJWT)

/*
router.route('/')
    .get(usersController.getAllUsers)
    .post(usersController.signUp)
*/

//router.get('/',verifyJWT, usersController.getAllUsers)
//router.delete('/:id',verifyJWT, usersController.deleteUser)
router.get('/balance', verifyJWT, usersController.getBalance)
router.put('/change-password', verifyJWT, usersController.changePassword);


module.exports = router