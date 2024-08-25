const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transactionController')
const verifyJWT = require('../middleware/verifyToken')

router.get('/', verifyJWT, transactionController.getUserTransactions)
router.post('/send', verifyJWT, transactionController.sendMoney)

module.exports = router
