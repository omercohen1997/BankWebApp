const Transaction = require('../models/Transaction')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')


const sendMoney = asyncHandler(async (req, res) => {
    const { receiverEmail, amount } = req.body
    const sender = req.user

    if (!receiverEmail || amount === undefined) {
        return res.status(400).json({ message: 'Receiver email and amount are required' })
    }

    if (receiverEmail ===  sender.email) {
        return res.status(400).json({ message: 'Receiver email need to be different from the sender email' })
    }

    if (amount <= 0) {
        return res.status(400).json({ message: 'Amount must be greater than zero' })
    }

    const receiver = await User.findOne({ email: receiverEmail }).exec()

    if (!receiver) {
        return res.status(404).json({ message: 'Receiver email does not exist' })
    }

    if (sender.balance < amount) {
        return res.status(400).json({ message: 'You dont have enough money to make the transaction' })
    }

    // Update the sender's balance
    sender.balance -= amount
    await sender.save()

    // Update the receiver's balance
    receiver.balance += amount
    await receiver.save()

    /*
    const senderTransaction = new Transaction({
        senderEmail: sender.email,
        receiverEmail,
        amount: -amount,
    });
    await senderTransaction.save()
    */
    const receiverTransaction = new Transaction({
        senderEmail: sender.email,
        receiverEmail,
        amount: amount,
    });
    await receiverTransaction.save()

    res.status(200).json({ message: 'Transaction completed successfully' })
})


const getUserTransactions = asyncHandler(async (req, res) => {
    const user = req.user
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const userEmail = user.email;

    // Find all transactions where the user is either the sender or the receiver
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

// Get all transactions (admin/manager)
const getAllTransactions = asyncHandler(async (req, res) => {
    const transactions = await Transaction.find().exec()
    if (transactions.length === 0) {
        return res.status(404).json({ message: 'No transactions found' })
    }
    res.status(200).json({ transactions })
})

// Get transactions by user ID (admin/manager)
const getTransactionsByUserId = asyncHandler(async (req, res) => {
    const { id } = req.params
    const transactions = await Transaction.find({
        $or: [
            { senderEmail: id },
            { receiverEmail: id }
        ]
    }).exec();

    if (transactions.length === 0) {
        return res.status(404).json({ message: 'No transactions found for this user' })
    }

    res.status(200).json({ transactions })
});


module.exports = {
    sendMoney,
    getUserTransactions,
    getAllTransactions,
    getTransactionsByUserId
}