'use strict'

const express = require('express')
const router = express.Router()

router.use('/v1/api', require('./access'))
// router.get('', (req, res) => {
//     res.json({test: 123})
// })

module.exports = router