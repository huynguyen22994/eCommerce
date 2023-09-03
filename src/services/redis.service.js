'use strict'

const redis = require('redis')
const { promisify } = require('util')
const { reservationInventory } = require('../models/repositories/inventory.repo')
const redisClient = redis.createClient()

const pexire = promisify(redisClient.pExpire).bind(redisClient) // promisify đùng để chuyển đổi 1 hàm thành một hàm sync/await
// const setnxAsync = promisify(redisClient.setnxAsync).bind(redisClient)
const setnxAsync = promisify(redisClient.setEx).bind(redisClient)

/**
 * Kỹ thuật đặt hàng trong kho quá bán, sử dụng acquireLock
 * Kỹ thuật khóa bi quan
 */
const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`
    const retryTimes = 10
    const expireTime = 3000 // 3 giây tạm block

    for(let i = 0; i < retryTimes; i++) {
        // tạo một key, khách hàng nào nắm giữ được key thì được vào thanh toán. giải quyết vấn đề số lượng mua phải thỏa kho
        const result = await setnxAsync(key, expireTime) // giá trị trả về là 1 và 0 (1: có người giữ key này, 0: chưa ai giũ key này)
        console.log(`result`, result)
        if(result === 1) {
            // Thao tác với inventory để cho phép đặt chổ trong kho
            const isReversation = await reservationInventory({
                productId, quantity, cartId
            })
            // nếu đặt chổ thành công
            if(isReversation.modifiedCount) {
                // cho user mới đặt chổ một khóa để tiến đến thanh toán và khóa này hiệu lực trong 3s
                await pexire(key, expireTime)
                return key
            }
            return null
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }

    }
}

const releaseLock = async keyLock => {
    const deleteAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await deleteAsyncKey(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock
}