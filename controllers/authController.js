const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const emailValidator = require('email-validator');


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

module.exports = {
    login,
    logout
}