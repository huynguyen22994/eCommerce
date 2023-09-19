'use strict'

const { connectToRabbitMQForTest } = require('../dbs/init.rabbitmq')

describe('RabbitMQ connection', () => {
    it('Should connect to successful RabbitMQ', async () => {
        const result = await connectToRabbitMQForTest()
        expect(result).toBeUndefined()
    })
})