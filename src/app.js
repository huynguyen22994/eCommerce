require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const app = express()

// init middwares
app.use(morgan('dev')) // use for development - app.use(morgan('combined')) - use for ngnix on production => get type access
app.use(helmet()) // use to safe header request
app.use(compression()) // Giúp giảm size cho request của khách hàng => giúp tiết kiệm băng thông => app nhanh hơn
app.use(express.json())
app.use(express.urlencoded({
    extended: true
    
}))

// init db
require('../src/dbs/init.mongodb')
// const { checkOverload, countConnect } = require('../src/helper/check.connect')
// checkOverload()

// init routes
app.use('/', require('./routes'))

// handle error
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const status = error.status || 500
    return res.status(status).json({
        status: 'error',
        code: status,
        message: error.message || 'Internal Server Error'
    })
})


module.exports = app