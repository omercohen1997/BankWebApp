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

router.get('/',verifyJWT, usersController.getAllUsers)
router.post('/', usersController.signUp)

router.delete('/:id',verifyJWT, usersController.deleteUser)
router.get('/:id/balance', verifyJWT, usersController.getBalance)

router.post('/verify-email', verifyJWT, usersController.verifyEmail)


module.exports = router