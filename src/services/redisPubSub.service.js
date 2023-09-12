'use strict'

const redis = require('redis')

class RedisPubSubService {

    constructor() {
        this.subcriber = redis.createClient()
        this.publisher = redis.createClient()
        this.publisher.connect()
        this.subcriber.connect()
        this.onError()
    }

    onError = () => {
        this.subcriber.on('error', err => console.log('Redis Client Error', err));
        this.publisher.on('error', err => console.log('Redis Client Error', err));
    }

    publish = async (chanel, message) => {
        return new Promise((resolve, reject) => {
            this.publisher.publish(chanel, message, (err, reply) => {
                if(err) reject(err)
                resolve(reply)
            })
        })
    }

    subscribe = async (chanel, callback) => {
        this.subcriber.subscribe(chanel, (message) => {
            callback(chanel, message)
        })
}

}

module.exports = new RedisPubSubService()