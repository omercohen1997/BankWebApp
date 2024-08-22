const User = require('../models/User')
const bcrypt = require('bcrypt')
const emailValidator = require('email-validator');

const nodemailer = require('nodemailer');
const crypto = require('crypto');




// Function to send verification code
const sendVerificationCode = async (email, code) => {
    // Set up your nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'omerc1997@gmail.com',
            pass: 'wwcn wiae mexc kibw'
        }
    });

    // Email options
    const mailOptions = {
        from: 'omerc1997@gmail.com',
        to: email,
        subject: 'Your Verification Code',
        text: `Your verification code is ${code}`
    };

    // Send email
    await transporter.sendMail(mailOptions);
}





// Create a new user
const signUp = async (req, res) => {
    const { password, phoneNumber, email, balance } = req.body;

    // Check if all required fields are provided
    if (!password || !phoneNumber || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    /*   const emailRegex = /.+\@.+\..+/;
      if (!emailRegex.test(email)) {
          return res.status(400).json({ message: 'Invalid email format' });
      } */

    // Validate email format using email-validator
    if (!emailValidator.validate(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }


    const phoneNumberRegex = /^(\d{3}-?\d{3}-?\d{4})$/;
    // Validate phone number format
    if (!phoneNumberRegex.test(phoneNumber)) {
        return res.status(400).json({ message: 'Invalid phone number format' });
    }


    // Check if the user already exists
    const duplicate = await User.findOne({ email }).lean().exec();

    if (duplicate) {
        return res.status(409).json({ message: 'User already exists the email should be unique' });
    }


    try {

        const verificationCode = crypto.randomBytes(3).toString('hex'); // 6 random digits

        // Create and store the new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            password: hashedPassword,
            phoneNumber,
            email,
            balance,
            verificationCode,
            isVerified: false
        });

        // Send the verification code to the user's email
        await sendVerificationCode(email, verificationCode);

        res.status(201).json({ message: `User with email ${email} created successfully` });
        //res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Verify user email
const verifyEmail = async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ message: 'Email and passcode are required' });
    }
    
    // Find the user by email
    const user = await User.findOne({ email }).exec();

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    console.log('User Code from db:', user.verificationCode )

    // Check if the verification code matches
    if (user.verificationCode !== code) {
        return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Update the user's isVerified status
    //TODO: Delete  user.verificationCode from database
    user.isVerified = true;
    user.verificationCode = null; // Clear the verification code
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
};






// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



// Delete a user by ID
const deleteUser = async (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Find and delete the user by ID
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        res.status(200).json({ message: 'User deleted successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get the balance of a specific user by ID
const getBalance = async (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        // Find the user by ID
        const user = await User.findById(userId).exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with the user's balance
        res.status(200).json({ balance: user.balance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




module.exports = {
    getAllUsers,
    signUp,
    deleteUser,
    getBalance,
    verifyEmail,
};
