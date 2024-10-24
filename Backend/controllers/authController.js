const User = require('../models/User')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const emailValidator = require('email-validator')
const { sendVerificationCode } = require('../services/emailServices')

const phoneNumberRegex = /^05\d(-\d{7}|\d{7})$/
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/


const signup = async (req, res) => {
    const { password, phoneNumber, email, balance } = req.body


    if (!password || !phoneNumber || !email) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' })
    }

    /*   if (!emailValidator.validate(email)) {
          return res.status(400).json({ message: 'Invalid email format' })
      }
   */

    // Validate phone number format
    if (!phoneNumberRegex.test(phoneNumber)) {
        return res.status(400).json({ message: 'Invalid phone number format' })
    }


    const duplicate = await User.findOne({ email }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'User already exists the email should be unique' })
    }


    try {

        const verificationCode = crypto.randomBytes(3).toString('hex') // 6 random digits
        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationCodeExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

        const newUser = await User.create({
            password: hashedPassword,
            phoneNumber,
            email,
            balance,
            verificationCode,
            isVerified: false,
            verificationCodeExpiresAt
        })

        // Send the verification code to the user's email
        await sendVerificationCode(email, verificationCode)

        res.status(201).json({ message: `User with email ${email} created successfully` })
        //res.status(201).json(newUser)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}


const verifyEmail = async (req, res) => {
    const { email, code } = req.body

    if (!email || !code) {
        return res.status(400).json({ message: 'Email and passcode are required' })
    }

    try {
        const user = await User.findOne({ email }).exec()

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        console.log('User Code from db:', user.verificationCode)

        // Incase the user try again to verify himself
        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' })
        }

        if (user.verificationCodeExpiresAt < Date.now()) {
            return res.status(400).json({ message: 'Verification code expired' })
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ message: 'Invalid verification code' })
        }


        user.isVerified = true
        user.verificationCode = null
        user.verificationCodeExpiresAt = null
        await user.save()

        res.status(200).json({ message: 'Email verified successfully' })
    } catch (error) {
        console.error('Error verifying email:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}


const signupAdmin = async (req, res) => {
    const { email, password, phoneNumber, adminSpecialKey } = req.body

    if (!email || !password || !phoneNumber || !adminSpecialKey) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    if (!emailValidator.validate(email)) {
        return res.status(400).json({ message: 'Invalid email format' })
    }

    if (!phoneNumberRegex.test(phoneNumber)) {
        return res.status(400).json({ message: 'Invalid phone number format' })
    }

    if (adminSpecialKey !== process.env.ADMIN_SIGNUP_KEY) {
        return res.status(403).json({ message: 'Invalid special key' })
    }


    try {
        const duplicate = await User.findOne({ email }).lean().exec()
        if (duplicate) {
            return res.status(409).json({ message: 'Email already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newAdmin = await User.create({
            email,
            password: hashedPassword,
            phoneNumber,
            balance: 1000,
            isVerified: true,
            role: 'admin'
        })

        /*
        // TODO: should i send a vertification code to an admin or should be immediatly verified?
        await sendVerificationCode(email, verificationCode)
        */

        res.status(201).json({ message: `Admin user ${email} created successfully` })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}




const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const user = await User.findOne({ email }).exec()

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' })
        }

        //TODO: Should i also check if the passcode expaired already (maybe sent a new one?)
        if (!user.isVerified) {
            return res.status(403).json({ message: 'User not verified. Please verify your email to log in.' })
        }


        // Creating the access token with the following info: 
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": user.email,
                    "role": user.role
                }
            },
            process.env.JWT_ACCESS_TOKEN,
            { expiresIn: '7d' }
        )

        res.cookie('jwt', accessToken, {
            httpOnly: true, //accessible only by web server / and not by the cliet side/javascript
            secure: true, //https
            sameSite: 'None', //cross-site cookie 
            maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: 7d. set to match the access token
        })

        // Send accessToken 
        res.json({ accessToken })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }

}

const logout = (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    })

    res.json({ message: 'Logged out successfully' })
}








module.exports = {
    signup,
    login,
    logout,
    signupAdmin,
    verifyEmail
}