const Transaction = require('../models/Transaction')
const User = require('../models/User')


/*

const performTransaction = async (req, res) => {
    const { senderEmail, receiverEmail, amount } = req.body;

    // Validate request parameters
    if (!senderEmail || !receiverEmail || !amount) {
        return res.status(400).json({ message: 'Sender email, receiver email, and amount are required' });
    }

    if (amount <= 0) {
        return res.status(400).json({ message: 'Amount must be greater than zero' });
    }

    try {
        // Find sender and receiver
        const sender = await User.findOne({ email: senderEmail }).exec();
        const receiver = await User.findOne({ email: receiverEmail }).exec();

        if (!sender) {
            return res.status(404).json({ message: 'Sender not found' });
        }

        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }

        // Check if the sender has enough balance
        if (sender.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Create and store transactions for sender and receiver
        const transactionForSender = new Transaction({
            senderEmail,
            receiverEmail,
            amount: -amount // Negative amount for sender
        });

        const transactionForReceiver = new Transaction({
            senderEmail,
            receiverEmail,
            amount: amount // Positive amount for receiver
        });

        await transactionForSender.save();
        await transactionForReceiver.save();

        // Update balances
        sender.balance -= amount;
        receiver.balance += amount;

        await sender.save();
        await receiver.save();

        res.status(200).json({ message: 'Transaction completed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
*/