const Transaction = require('../models/Transaction')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')

const sendMoney = asyncHandler(async (req, res) => {
    const { receiverEmail, amount } = req.body
    const sender = req.user

    if (!receiverEmail || amount === undefined) {
        return res.status(400).json({ message: 'Receiver email and amount are required' })
    }

    if (receiverEmail === sender.email) {
        return res.status(400).json({ message: 'Receiver email needs to be different from the sender email' })
    }
    
    const amountParse = parseFloat(amount);

    if (isNaN(amountParse)){
        return res.status(400).json({message: 'The amount field must be a number'})
    }

    if (amountParse <= 0) {
        return res.status(400).json({ message: 'Amount must be greater than zero' })
    }

    const session = await mongoose.startSession()

    try {
        await session.withTransaction(async () => {
            const receiver = await User.findOne({ email: receiverEmail }).session(session)

            if (!receiver) {
                throw new Error('Receiver email does not exist')
            }

            if (sender.balance < amountParse) {
                throw new Error('You dont have enough money to make the transaction')
            }

            sender.balance -= amountParse
            receiver.balance += amountParse

            await Promise.all([
                sender.save({ session }),
                receiver.save({ session }),
               // receiver.save({ session }).then(() => { throw new Error('Simulated error during receiver save') }),

                new Transaction({
                    senderEmail: sender.email,
                    receiverEmail,
                    amount: amountParse,
                }).save({ session })
            ])
        })

        res.status(200).json({ message: 'Transaction completed successfully' })

    } catch (error) {
        console.error('Transaction error:', error)
        res.status(400).json({ message: error.message })

    } finally {
        session.endSession()
    }
})


const getUserTransactions = asyncHandler(async (req, res) => {
    const user = req.user
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const userEmail = user.email

    const transactions = await Transaction.find({
        $or: [
            { senderEmail: userEmail },
            { receiverEmail: userEmail }
        ]
    }).exec()

    if (transactions.length === 0) {
        return res.status(404).json({ message: 'No transactions found for this user' })
    }

    res.status(200).json({ transactions })
})

const getAllTransactions = asyncHandler(async (req, res) => {
    const transactions = await Transaction.find().exec()
    if (transactions.length === 0) {
        return res.status(404).json({ message: 'No transactions found' })
    }
    res.status(200).json({ transactions })
})

const getTransactionsByUserId = asyncHandler(async (req, res) => {
    const { id } = req.params
    const transactions = await Transaction.find({
        $or: [
            { senderEmail: id },
            { receiverEmail: id }
        ]
    }).exec()

    if (transactions.length === 0) {
        return res.status(404).json({ message: 'No transactions found for this user' })
    }

    res.status(200).json({ transactions })
})


module.exports = {
    sendMoney,
    getUserTransactions,
    getAllTransactions,
    getTransactionsByUserId
}