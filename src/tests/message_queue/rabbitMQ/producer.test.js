const amqp = require('amqplib')
const message = 'hello. RabbitMQ for Frist Time'

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true // mở tính năng gửi lại message nếu trường hợp server down chưa kịp gửi dữ liệu => tránh trường hợp mất dữ liệu
        })

        // send message to customer channel
        channel.sendToQueue(queueName, Buffer.from(message))
        console.log(`message sent::::`, message)

    } catch (err) {
        console.error(err)
    }
}

runProducer().catch(console.error)