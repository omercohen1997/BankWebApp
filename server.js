require('dotenv').config();
const express = require('express')
const app = express()
const path = require('path')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/dbConnect')
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV);

connectDB()

app.use(express.json())
app.use(logger) 
app.use(cookieParser())
// Tell to express where to find static files like css file or images that we would use .
app.use('/', express.static(path.join(__dirname, 'public')));
// This also would work :  app.use(express.static(public')) ;
app.use('/', require('./routes/root'))


app.use('/users',require('./routes/users'))

// '*' = Define a route handler that matches all HTTP methods (GET, POST, PUT, DELETE, etc.)
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
});

app.use(errorHandler)

// This event listener is triggered once the connection to the MongoDB database has successfully opened.
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
});

mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
});
