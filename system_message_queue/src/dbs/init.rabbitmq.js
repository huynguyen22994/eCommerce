'use strict'

const amqp = require('amqplib')
const config = require('dotenv').config()
const { RABBIT_USER = 'guest', RABBIT_PASSWORD = '12345', RABBIT_HOST = 'localhost' } = config

const connectToRabbitMQ = async () => {
    try {
        const connecttion = await amqp.connect(`amqp://${RABBIT_USER}:${RABBIT_PASSWORD}@${RABBIT_HOST}`)
        if(!connecttion) throw new Error('Connection is not established!!')

        const channel = await connecttion.createChannel()
        return { channel, connecttion }
    } catch(err) {
        console.error(err)
    }
}

const connectToRabbitMQForTest = async () => {
    try {
        const { channel, connecttion } = await connectToRabbitMQ()

        const queue = 'test-queue'
        const message = 'Hello, this is first message'
        await channel.assertQueue(queue)
        await channel.sendToQueue(queue, Buffer.from(message))

        // close the connection
        await connecttion.close()
    } catch(error) {
        console.error('Error connect to RabbitMQ', error)
    }
}

module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTest
}