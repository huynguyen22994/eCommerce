'use strict'

const express = require('express')
const NotificationController = require('../../controllers/notification.controller')
const { asyncHandle } = require('../../helper/asyncHandle')
const { authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()

// Có 2 loại user sẽ nhận một số notice khác nhau là: 1 User chưa login và 2 là User đã login
// Here not login

router.use(authenticationV2)
// Here logined
router.get('', asyncHandle(NotificationController.listNotiByUser))

module.exports = router