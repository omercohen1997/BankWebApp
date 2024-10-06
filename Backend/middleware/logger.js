const { format } = require('date-fns') // library to format dates
const { v4: uuid } = require('uuid')
const fs = require('fs') // module that helps to perform filesystem operations like reading or writing files.
const fsPromises = require('fs').promises // help to perform asynchronous filesystem operations using promises 
const path = require('path') // provides utilities for working with file and directory paths.

// function logs messages to a file.
const logEvents = async (message, logFileName) => {
    const dateTime = format(new Date(), 'dd/MM/yyyy\tHH:mm:ss') 
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`
    
    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
    } catch (err) {
        console.log(err)
    }
}


//  middleware that logs HTTP requests.
const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    console.log(`${req.method} ${req.path}`)
    next()
}

module.exports = { logEvents, logger }
