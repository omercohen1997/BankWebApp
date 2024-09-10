/*
    This middleware will verify a valid token
     everytime we make a request to a protected endpoint.
*/
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const verifyJWT = async (req, res, next) => {
    try {
        // if token is stored header: Inside the req header authorization can be lower or capital case.
        const authHeader = req.headers.authorization || req.headers.Authorization
        const tokenFromHeader = authHeader && authHeader.split(' ')[1];
    
        // If token is stored in cookies
        const cookieToken = req.cookies.jwt;
    
        const validToken = tokenFromHeader || cookieToken;
    
        if (!validToken){
            return res.status(401).json({ message: 'Unauthorized: No token provided' })
            
        } 
       
        jwt.verify(validToken, process.env.JWT_ACCESS_TOKEN, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden: Invalid token' })
            }
            const user = await User.findOne({ email: decoded.UserInfo.email }).exec()
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized: User not found' })
            }

            req.user = user
            
            next()
        })

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}
module.exports = verifyJWT 