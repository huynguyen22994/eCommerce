'use strict'

const DeveloperService = require('../services/developer.service')
const { OK, CREATED, SuccessResponse } = require('../core/success.response')

class DevloperController {

    login = async (req, res, next) => {
        new SuccessResponse({
            message: 'Login OK',
            metadata: await DeveloperService.login({
                ...req.body
            }, req, res)
        })
    }

}

module.exports = new DevloperController();