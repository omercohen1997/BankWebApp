const rateLimit = require('express-rate-limit')
const { logEvents } = require('./logger')


// In short every time a client sends a request (e.g., to the login route), express-rate-limit checks the client's IP (req.ip).
const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 login requests per `window` per minute
    message:
        { message: 'Too many login attempts from this IP, please try again after a 60 second pause' },
    handler: (req, res, next, options) => { // custom handler function that is executed when a user exceeds the rate limit
        logEvents(`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 
            'errLog.log')
        res.status(options.statusCode).send(options.message)
    }, 
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers (like RateLimit-Limit: The total request limit, 5 in this case).

    legacyHeaders: false, // Disable the `X-RateLimit-*` headers (older header, used in past)
})

module.exports = loginLimiter