const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transactionController')
const verifyJWT = require('../middleware/verifyToken')
const checkRole = require('../middleware/checkRole')



router.get('/', verifyJWT, checkRole('user','admin','manager'), transactionController.getUserTransactions)
router.post('/send', verifyJWT, checkRole('user'), transactionController.sendMoney)


router.get('/all-transactions', verifyJWT,checkRole('admin','manager'), transactionController.getAllTransactions)
router.get('/user/:id', verifyJWT,checkRole('admin','manager'), transactionController.getTransactionsByUserId)



module.exports = router
