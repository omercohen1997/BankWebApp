const mongoose = require('mongoose');
const { Schema } = mongoose;

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

    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
