const amqp = require('amqplib')

const runComsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true // mở tính năng gửi lại message nếu trường hợp server down chưa kịp gửi dữ liệu => tránh trường hợp mất dữ liệu
        })

        // receive message to customer channel
        channel.consume(queueName, (messages) => {
            //console.log('Buffer ::::::', messages)
            console.log(`Receivew text::::: ${messages.content.toString()} messages`)
        }, {
            noAck: true // Dử liệu xử lý rồi sẽ không gửi lại nữa
        })  

    } catch (err) {
        console.error(err)
    }
}

runComsumer().catch(console.error)