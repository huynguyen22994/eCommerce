'use strict'

const AccessService = require('../services/access.service')
const { OK, CREATED } = require('../core/success.response')

class AccessController {

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
}

module.exports = new AccessController();