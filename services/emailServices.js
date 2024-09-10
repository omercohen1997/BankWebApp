const nodemailer = require('nodemailer')
require('dotenv').config()


// Function to send verification code
const sendVerificationCode = async (email, code) => {
    // Set up your nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    // Email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Verification Code',
        text: `Your verification code is ${code}`
    }

    // Send email
    await transporter.sendMail(mailOptions)
}



module.exports = {
    sendVerificationCode
}