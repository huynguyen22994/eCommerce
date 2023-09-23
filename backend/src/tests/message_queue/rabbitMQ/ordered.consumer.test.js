'use strict'
const amqp = require('amqplib')

const consumerOrderMessage = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true // mở tính năng gửi lại message nếu trường hợp server down chưa kịp gửi dữ liệu => tránh trường hợp mất dữ liệu
        })
        

        // Dùng prefetch để xử lý vấn đề message xử lý không tuần tự => giống khai niệm mutex trong xử lý dữ liệu đồng thời cao
        // set prefetch để đảm bảo rằng những tác vụ này chỉ đảm bảo thực hiện cùng một lúc mà thôi
        channel.prefetch(1)

        channel.consume(queueName, (msg) => {
            const message = msg.content.toString()
            
            setTimeout(() => {
                console.log(`Processed:::: ${ message }`)
                channel.ack(msg)
            }, Math.random() * 1000) // trong doạn này là xử lý không tuần tự => dễ gây sai lầm cho kinh doanh
        })

        // setTimeout(() => {
        //     connection.close()
        // }, 1000)

    } catch (error) {
        console.error(error)
    }
}

consumerOrderMessage().catch((err) => console.error(err))