require('dotenv').config();
const express = require('express')
const path = require('path') // provides utilities for working with file and directory paths.
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/dbConnect')
const mongoose = require('mongoose')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')


const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV)

const app = express()
connectDB()

app.use(cors(corsOptions))
app.use(logger)
app.use(express.json())
app.use(cookieParser()) // middleware to handle cookies for incoming requests, parse add the cookie to req.cookies

// Tell to express where to find static files like css file or images that we would use .
app.use('/', express.static(path.join(__dirname, 'public')))


// This also would work :  app.use(express.static(public')) 
// TODO: Add api to the route
app.use('/', require('./routes/rootRoutes'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userManagementRoutes'))
app.use('/transactions', require('./routes/transactionRoute'))


/* '*' = Define a route handler that matches all HTTP methods (GET, POST, PUT, DELETE, etc.)
    that hasn't been matched by previous route handler. Meaning pages/routes that are not exsists
*/
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})


app.use(errorHandler)

/* This event listener is triggered once the connection to the MongoDB database has successfully opened.
    * once method: registers a one-time listener for a specific event will be executed only once when the event is triggered.
        'open' is the event it is listening for.
    
    * This is needed in order to avoid from the server to run before the connection to the DB, and to avoid the case 
        that the server will run altought the connection to the db is failed.
*/
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
