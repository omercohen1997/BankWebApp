const User = require('../models/User')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { sendVerificationCode } = require('../services/emailServices')
const { phoneNumberRegex, emailRegex } = require('../utils/validatePatterns')

const signup = async (req, res) => {
    const { password, phoneNumber, email } = req.body


    if (!password || !phoneNumber || !email) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' })
    }

    if (!phoneNumberRegex.test(phoneNumber)) {
        return res.status(400).json({ message: 'Invalid phone number format' })
    }

    try {

        const duplicate = await User.findOne({ email }).lean().exec()

        if (duplicate) {
            return res.status(409).json({ message: 'User already exists the email should be unique' })
        }

        const verificationCode = crypto.randomBytes(3).toString('hex')
        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationCodeExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

        await User.create({
            email,
            password: hashedPassword,
            phoneNumber,
            balance: 2000,
            isVerified: false,
            verificationCode,
            verificationCodeExpiresAt
        })

        await sendVerificationCode(email, verificationCode)

        res.status(201).json({ message: `User with email ${email} created successfully` })
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

        if (user.isVerified) {
            return res.status(400).json({ message: 'User is already verified' })
        }

        if (user.verificationCodeExpiresAt < Date.now()) {
            //TODO: add delete user if expire or another solution
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
            httpOnly: true, //  disable using the cookie from the javascript in the browser.
            secure: true, // true means the cookie will only be sent over HTTPS connections
            sameSite: 'None', //cross-site cookie 
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

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
    verifyEmail
}