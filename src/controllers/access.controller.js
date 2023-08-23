'use strict'

const AccessService = require('../services/access.service')
const { OK, CREATED, SuccessResponse } = require('../core/success.response')

class AccessController {

    logIn = async (req, res, next) => {
        new SuccessResponse({
            message: 'Login Ok',
            metadata: await AccessService.login(req.body)
        }).send(res)
    }

    logOut = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout Ok',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }

    signUp = async (req, res ,next) => {
        // return res.status(201).json({
        //     code: '20001', // Code này do team lập trình tự đưa định nghĩa -> khác với code 201 của REST
        //     metadata: { useId: 1 }
        // })
        // return res.status(201).json(await AccessService.signup(req.body)) -> Cách này củ và thay bằng Class success reposne
        // bỏ try catch vì sẽ xử lý nén lỗi ở middleware ở routes/access/index

        console.log(`[p]::signup:::`, req.body)
        new CREATED({
            message: 'Registed OK',
            metadata: await AccessService.signup(req.body),
            options: {
                message: 'Write something'
            }
        }).send(res)
    }

    handleRefreshToken = async (req, res ,next) => {
        // v1: use function authentication
        // new SuccessResponse({
        //     message: 'Get new token success!',
        //     metadata: await AccessService.handleRefreshToken(req.body.refreshToken)
        // }).send(res)

        // v2: use authenticationV2 -> handle block access by only checking asscessToken
        new SuccessResponse({
            message: 'Get new token success!',
            metadata: await AccessService.handleRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)

    }
}

module.exports = new AccessController();