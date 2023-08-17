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

// init db
require('../src/dbs/init.mongodb')
const { checkOverload, countConnect } = require('../src/helper/check.connect')
//checkOverload()

app.get('/', (req, res) => {
    countConnect();
    res.json({test: 123})
})

// init routes

// handle error

module.exports = app