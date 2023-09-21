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

            // 1. Trường Hợp Lỗi TTL => Use timeout to => err TTL in Queue => hanlder bay DLX
            // const timeExperied = 15000
            // setTimeout(() => {
            //     channel.consume(notiQueue, (msg) => {
            //         console.error('Send notification successfully processed:', msg.content.toString())
            //         // Xử lý nghiệp vụ login khi messages gửi quá Time Live
            //         channel.ack(msg)
            //     })
            // }, timeExperied)

            // 2. Trường hợp lỗi Logic
            channel.consume(notiQueue, (msg) => {
                try {
                    const numberTest = Math.random()
                    console.log({ numberTest })
                    if(numberTest < 0.8) {
                        throw new Error('Sen notification error:: hot fix')
                    }
    
                    console.log(`Send notification successfully processed:`,  msg.content.toString())
                    channel.ack(msg)
                } catch(err) {
                    console.error('Dend notification error:')
                    // Chí ý nack => vì nó dùng để xử lý tin nhắn bị fail do logic => xử lý đẩy vào hàng đợi DLX
                    channel.nack(msg, false, false) 
                    /*
                        nack: negative acknowledgement: nhiệm vụ của .nack() là khi có lỗi queue thì sẽ tự động ném vào queue 'notificationQueueHotFix' để xử lý lại
                        Đối số 1 msg: là đối tượng tin nhắn nhận dk từ hàng đợi trước, và giờ cần phải đẩy lại vào hàng đợi xử lý lỗi
                        Đối số 2 'false': là đối số để chỉ định có nên sắp xếp lại tin nhắn hay không. false => ko dk đưa vào hàng đợi ban đầu nữa mà đẩy vào hàng đợi bị lỗi. Nếu đặt true thì đẩy ngược lại hàng đợi 'notificationQueueProcess'
                        Đối số 3 'false': Nó chỉ định xem muốn từ chối nhiều thư hay không. Nếu đặt false -> chỉ tin nhắn hiện tại này bị từ chối. Nếu là true -> các tin nhắn còn lại đều bị từ chối
                    */
                        
                }
            })

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