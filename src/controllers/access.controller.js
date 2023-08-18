'use strict'

const AccessService = require('../services/access.service')

class AccessController {

    signUp = async (req, res ,next) => {
        console.log(`[p]::signup:::`, req.body)
        /*
            200::: OK
            202::: CREATED
        */
        // return res.status(201).json({
        //     code: '20001', // Code này do team lập trình tự đưa định nghĩa -> khác với code 201 của REST
        //     metadata: { useId: 1 }
        // })
        return res.status(201).json(await AccessService.signup(req.body))
        // bỏ try catch vì sẽ xử lý nén lỗi ở middleware ở routes/access/index
    }
}

module.exports = new AccessController();