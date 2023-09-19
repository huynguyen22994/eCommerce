'use strict'
const mongoose = require('mongoose')
const { 
    MONGO_HOST = 'localhost',
    MONGO_PORT = 27017,
    MONGO_DBNAME = 'shopDev'
} = require('dotenv').config()

const connectString = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DBNAME}`
// console.log(`Connect DB:::`, connectString)

// use Singleton Pattern
class Database {
    constructor() {
        this.connect()
    }

    // connect
    async connect(type = 'mongodb') {
        if(1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }
        return await mongoose.connect(connectString, {
            maxPoolSize: 50 // PoolSize dùng để giới hạn lượng connect, nếu vượt phái giới hạn poolsize thì connect mới phải đứng vào hàng đợi đến khi có một connect củ ngưng xử dụng dịch vụ
        })
    }

    static getInstance() {
        if(!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb
