const amqp = require('amqplib')
const message = 'hello. RabbitMQ for Frist Time'

// overwrite consloe.log to print time
// const log = console.log
// console.log = () => {
//     log.apply(console, [new Date()].concat(arguments))
// }

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost')
        const channel = await connection.createChannel()

        const notificationExchange = 'notificationEx' // notification exchange direct
        const notiQueue = 'notificationQueueProcess' // assertQueue
        const notificationExchangeDLX = 'notificationExDLX' // notification direct
        const notificationRoutingKeyDLX = 'notificationRountingKeyDLX' // assert
 
        // 1. Create Exchange
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true
        })

        // 2. Create Queue
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false, // cho phép các kết nối truy cập cùng một lúc hàng đợi
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        })

        // 3. bindQueue - bước này dùng de973 định tuyến cho Queue nếu có message fail sẽ đẩy sang notificationExchange
        await channel.bindQueue(queueResult.queue, notificationExchange)

        // 4. Send message
        const msg = 'A new product created:: from backend server::::'
        console.log('Product message::', msg)
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: '10000' // Queue chỉ cho phép message được send trong khoản thời gain này, nếu vượt quá thì sẽ đưa vào DLX
        })

        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500)
    } catch (err) {
        console.error(err)
    }
}

runProducer().then(er => console.log(er)).catch(console.error)