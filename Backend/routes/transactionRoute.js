const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transactionController')
const checkRole = require('../middleware/checkRole')



router.get('/', checkRole('user','admin','manager'), transactionController.getUserTransactions)
router.post('/send',checkRole('user'), transactionController.sendMoney)


router.get('/all-transactions',checkRole('admin','manager'), transactionController.getAllTransactions)
router.get('/user/:id', checkRole('admin','manager'), transactionController.getTransactionsByUserId)



module.exports = router
