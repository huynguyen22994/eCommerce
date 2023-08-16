'use strict'
const mongoose = require('mongoose')
const { countConnect } = require('../helper/check.connect')

const connectString = 'mongodb://127.0.0.1:27017/shopDev'

// use Singleton Pattern
class Database {
    constructor() {
        this.connect()
    }

    // connect
    connect(type = 'mongodb') {
        if(1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }
        mongoose.connect(connectString, {
            maxPoolSize: 50 // PoolSize dùng để giới hạn lượng connect, nếu vượt phái giới hạn poolsize thì connect mới phải đứng vào hàng đợi đến khi có một connect củ ngưng xử dụng dịch vụ
        }).then( _ => { 
            console.log(`Connected Mongodb Success for Pro`)
            countConnect()
        })
        .catch( err => console.log(`Error Connect!`))
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
