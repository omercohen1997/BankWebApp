const User = require('../models/User')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const emailValidator = require('email-validator');
const { sendVerificationCode } = require('../services/emailServices')


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email }).exec()
        //TODO: Should i check if the user is verfied?
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Unauthorized' })
        }

        // Creating the access token with the following info: 
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": user.email,
                    // "roles": admin --> This will be added in the future
                }
            },
            process.env.JWT_ACCESS_TOKEN,
            { expiresIn: '7d' }
        )

        // Create secure cookie with access token 
        res.cookie('jwt', accessToken, {
            httpOnly: true, //accessible only by web server 
            secure: true, //https
            sameSite: 'None', //cross-site cookie 
            maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: 7d. set to match the access token
        })

        // Send accessToken 
        res.json({ accessToken })
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

}

const logout = (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    });

    res.json({ message: 'Logged out successfully' });

}



// Create a new user
const signup = async (req, res) => {
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
}


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



module.exports = {
    signup,
    login,
    logout,
    verifyEmail
}