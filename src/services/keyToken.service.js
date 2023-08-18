'use strict'
const keytokenModel = require('../models/keytoken.model')
const { Types } = require('mongoose')

class KeyTokenService {

    static createToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // level 0 -> cách create bên dưới sau này dẫn đến collection keyTokens sẽ chưa nhiều dữ liệu ko dùng đến -> use level xx
            const publicKeyString = publicKey.toString() // Buffer to string
            const privateKeyString = privateKey.toString()
            // const tokens = await keytokenModel.create({
            //     user: userId,
            //     publicKey: publicKeyString,
            //     privateKey: privateKeyString
            // })
            // return tokens ? { publicKeyString: tokens.publicKey, privateKeyString: tokens.privateKey } : {}

            // level xx
            const filter = { user: userId }, update = { publicKey: publicKeyString, privateKey: privateKeyString, refreshTokensUsed: [], refreshToken };
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, { new: true, upsert: true })
            return tokens ? { publicKeyString: tokens.publicKey, privateKeyString: tokens.privateKey } : {}

        } catch(error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({ user: new Types.ObjectId(userId) }).lean()
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne({ _id: new Types.ObjectId(id) })
    }
}

module.exports = KeyTokenService