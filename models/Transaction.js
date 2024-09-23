const mongoose = require('mongoose')
const { Schema } = mongoose

const transactionSchema = new Schema({
    senderEmail: {
        type: String,
        required: true
    },
    receiverEmail: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },

},{
    timestamps: true
})

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = Transaction
