'use strict'

const { consumerToQueue } = require('./src/services/consumer.service')
const queueName = 'test-queue'

consumerToQueue(queueName).then(() => {
    console.log(`Message consumer started [ ${ queueName } ] :::`)
}).catch((error) => {
    console.log(`Message Error: ${ error.message }`)
})