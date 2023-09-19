'use strict'

const NotificationService = require('../services/notification.service')
const { OK, CREATED, SuccessResponse } = require('../core/success.response')

class NotificationController {

    listNotiByUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'get listNotiByUser',
            metadata: await NotificationService.listNoticeByUser(req.query)
        }).send(res)
    }

}

module.exports = new NotificationController()