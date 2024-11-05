const rateLimit = require('express-rate-limit')
const { logEvents } = require('./logger')


// In short every time a client sends a request (e.g., to the login route), express-rate-limit checks the client's IP (req.ip).
const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, 
    message:
        { message: 'Too many login attempts , please try again after a 60 second pause' },
    handler: (req, res, next, options) => { 
        logEvents(`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 
            'errLog.log')
        res.status(options.statusCode).send(options.message)
    }, 
    standardHeaders: true, 

    legacyHeaders: false, 
})

module.exports = loginLimiter