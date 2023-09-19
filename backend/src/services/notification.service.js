'use strict'

const { NOTI } = require('../models/notification.model')
const { NOTI_TYPES } = require('../utils/constant')
const [ORDER_1, ORDER_2, PROMOTION_1, SHOP_1 ] = NOTI_TYPES //'ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'

class NotificationService {
    static NOTI_TYPES = [...NOTI_TYPES]

    static pushNotiToSystem = async ({ type = SHOP_1, receivedId = 1, senderId = 1, options = {} }) => {
        let noti_content

        switch (type) {
            case SHOP_1:
                noti_content = `@@@ vừa mới thêm sản phẩm: @@@@`
                break;
            case PROMOTION_1:
                noti_content = `@@@ vừa mới them6 một voucher: @@@@`
                break;
            default:
                noti_content = `Nothing @@@@`
                break;
        }

        const newNoti = await NOTI.create({
            noti_type: type,
            noti_content,
            noti_senderId: senderId,
            noti_receivedId: receivedId,
            noti_options: options
        })

        return newNoti
    }

    static listNoticeByUser = async ({ userId = 1, type = 'ALL', isRead = 0 }) => {
        const match = {
            noti_receivedId: userId
        }
        if(type !== 'ALL') {
            match['noti_type'] = type
        }

        // Aggregate: tính năng của mongodb cho phép thực hiện toán tử phức tạp, nhóm, sort trong truy vấn dữ liệu Mongo
        return await NOTI.aggregate([
            {
                $match: match
            },
            {
                $project: {
                    noti_type: 1,
                    noti_senderId: 1,
                    noti_receivedId: 1,
                    noti_content: 1,
                    createAt: 1,
                    noti_options: 1,
                    noti_content_message: { // Cách nối thành full content nên làm ở Frontend để hiệu suất cao hơn. Làm ở Back sẽ làm hiệu suất bị giảm do truy vấn phức tạp hơn
                        $concat: [
                            {
                                $substr: ['$noti_options.shop_name', 0, -1]
                            },
                            ' Vừa mới thêm một sản phẩm mới: ', // language
                            {
                                $substr: ['$noti_options.product_name', 0, -1]
                            }
                        ]
                    }
                } 
            }
        ])
    }
}

module.exports = NotificationService