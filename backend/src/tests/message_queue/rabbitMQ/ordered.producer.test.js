'use strict'
const amqp = require('amqplib')

const producerOrderMessage = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true // mở tính năng gửi lại message nếu trường hợp server down chưa kịp gửi dữ liệu => tránh trường hợp mất dữ liệu
        })

        for(let i =0; i < 10; i++) {
            const message = `ordered queued message:: ${i}`
            console.log(message)
            channel.sendToQueue(queueName, Buffer.from(message), {
                persistent: true // Cố gắng gửi
            })
        }

        setTimeout(() => {
            connection.close()
        }, 1000)

    } catch (error) {
        console.error(error)
    }
}

producerOrderMessage().catch((err) => console.error(err))