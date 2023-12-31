require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const cors = require('cors')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const session = require('express-session')
const path = require('path')
const app = express()

// init middwares
app.use(cors())
app.use(morgan('dev')) // use for development - app.use(morgan('combined')) - use for ngnix on production => get type access
app.use(helmet()) // use to safe header request
app.use(compression()) // Giúp giảm size cho request của khách hàng => giúp tiết kiệm băng thông => app nhanh hơn
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: 'session-secret-key',
    resave: false,
    saveUninitialized: true
}))

// Test pub and sub redis
// require('../src/tests/inventory.pubsub.test')
// const productTest = require('../src/tests/product.pubsub.test')
// setTimeout(() => { productTest.purchaseproduct('product:001', 10) }, 1000)

// init db
require('../src/dbs/init.mongodb')
// const { checkOverload, countConnect } = require('../src/helper/check.connect')
// checkOverload()

// init api docs
const { apiDocsV1 } = require('./configs/config.swagger')
const { devAuthen } = require('./auth/checkAuth.developer')
app.use('/api-docs-v1', devAuthen, swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(apiDocsV1)))
app.get('/login-api.html', (req, res) => { res.sendFile(path.join(__dirname + '/public/login-api.html')) })
// init graphql
app.all('/graphql', require('./graphql'));

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