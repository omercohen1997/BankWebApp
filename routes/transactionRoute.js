const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transactionController')
const verifyJWT = require('../middleware/verifyToken')
const checkRole = require('../middleware/checkRole');



// logged-in user  TODO:(Should the admin/manager count also as a noraml user?)
router.get('/', verifyJWT, checkRole('user','admin','manager'), transactionController.getUserTransactions)
router.post('/send', verifyJWT, checkRole('user','admin','manager'), transactionController.sendMoney)


router.get('/all-transactions', verifyJWT,checkRole('admin','manager'), transactionController.getAllTransactions)
router.get('/user/:id', verifyJWT, verifyJWT,checkRole('admin','manager'), transactionController.getTransactionsByUserId)



module.exports = router
