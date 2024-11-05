require('dotenv').config();
const express = require('express')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/dbConnect')
const mongoose = require('mongoose')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const verifyJWT = require('./middleware/verifyToken')


const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV)

const app = express()
connectDB()

app.use(cors(corsOptions))
app.use(logger)
app.use(express.json())
app.use(cookieParser()) // middleware to handle cookies for incoming requests, parse add the cookie to req.cookies

// TODO: Add api to the route
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', verifyJWT,require('./routes/userManagementRoutes'))
app.use('/transactions', verifyJWT, require('./routes/transactionRoute'))



app.all('*', (req, res) => {
    res.status(404).json({ message: '404 Not Found' });
});


app.use(errorHandler) //  it will only execute when an error occurs in the application. 

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
