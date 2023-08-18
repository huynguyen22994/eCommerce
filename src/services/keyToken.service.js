'use strict'
const keytokenModel = require('../models/keytoken.model')

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
}

module.exports = KeyTokenService