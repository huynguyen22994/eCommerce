'use strict'

const { consumerQueue, connectToRabbitMQ } = require('../dbs/init.rabbitmq')

// overwrite consloe.log to print time
// const log = console.log
// console.log = () => {
//     log.apply(console, [new Date()].concat(arguments))
// }

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
    
    // case processing
    static cosumerToQueueNormal = async (queueName) => {
        try {
            const { channel, connecttion } = await connectToRabbitMQ()
            const notiQueue = 'notificationQueueProcess'

            // channel.consume(notiQueue, (msg) => {
            //     console.log('Send notification successfully processed:', msg.content.toString())
            //     channel.ack(msg)
            // })

            // Use timeout to => err TTL in Queue => hanlder bay DLX
            const timeExperied = 15000
            setTimeout(() => {
                channel.consume(notiQueue, (msg) => {
                    console.error('Send notification successfully processed:', msg.content.toString())
                    // Xử lý nghiệp vụ login khi messages gửi quá Time Live
                    channel.ack(msg)
                })
            }, timeExperied)

        } catch(err) {
            console.log(err)
        }
    }

    // case faild processing
    static consumerToQueueFailed = async () => {
        try {
            const { channel, connecttion } = await connectToRabbitMQ()

            const notificationExchangeDLX = 'notificationExDLX' // notification direct
            const notificationRoutingKeyDLX = 'notificationRountingKeyDLX' // assert

            const notiQueueHandler = 'notificationQueueHotFix'

            await channel.assertExchange(notificationExchangeDLX, 'direct', {
                durable: true
            })

            const queueResult = await channel.assertQueue(notiQueueHandler, {
                exclusive: false
            })

            await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyDLX)
            await channel.consume(queueResult.queue, (msgFailed) => {
                console.log('This notification error: pls hot fix:::', msgFailed.content.toString())
            }, {
                noAck: true
            })

        } catch(err) {
            console.error(err)
            throw err
        }
    }
}

module.exports = MessageService