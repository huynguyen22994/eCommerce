'use strict'

const mongoose = require('mongoose')

const testSchema = new mongoose.Schema({ name: String })
const testModel = mongoose.model('Test', testSchema)

describe('Mongoose connection testing', () => {
    let connection

    beforeAll( async () => {
        require('../dbs/init.mongodb')
    })

    afterAll(() => {
        mongoose.connection.close(true)
    });

    it('Should connect to mongoose', async () => {
        expect(mongoose.connection.readyState).toBe(2)
    })

    it('Should save a document to the database', async () => {
        const user = new testModel({ name: 'Huy Nguyen' })
        await user.save()
        expect(user.isNew).toBe(false)
    })

    it('should find a document in the database', async () => {
        const user = await testModel.findOne({ name: 'Huy Nguyen' })
        expect(user).toBeDefined()
        expect(user.name).toBe('Huy Nguyen')
    })
})