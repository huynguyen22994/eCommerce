'use strict'

const { consumerQueue, connectToRabbitMQ } = require('../dbs/init.rabbitmq')

class MessageService {
    static consumerToQueue = async (queueName) => {
        try {
            // Consumer thì không cần đóng connection -> chỉ có producer thì cần đóng
            const { channel, connecttion } = await connectToRabbitMQ()
            await consumerQueue(channel, queueName)
        } catch (err) {
            console.error(`Error consumer to queue::`, err)
        }
    }
}

module.exports = MessageService