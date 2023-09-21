'use strict'

const { consumerToQueue, consumerToQueueFailed, cosumerToQueueNormal } = require('./src/services/consumer.service')
const queueName = 'test-queue'

// consumerToQueue(queueName).then(() => {
//     console.log(`Message consumer started [ ${ queueName } ] :::`)
// }).catch((error) => {
//     console.log(`Message Error: ${ error.message }`)
// })

cosumerToQueueNormal(queueName).then(() => {
    console.log(`Message consumer cosumerToQueueNormal started [ ${ queueName } ] :::`)
}).catch((error) => {
    console.log(`Message Error: ${ error.message }`)
})


consumerToQueueFailed(queueName).then(() => {
    console.log(`Message consumer consumerToQueueFailed started [ ${ queueName } ] :::`)
}).catch((error) => {
    console.log(`Message Error: ${ error.message }`)
})