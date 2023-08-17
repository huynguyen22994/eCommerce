'use strict'
const keytokenModel = require('../models/keytoken.model')

class KeyTokenService {

    static createToken = async ({ userId, publicKey, privateKey }) => {
        try {
            const publicKeyString = publicKey.toString() // Buffer to string
            const privateKeyString = privateKey.toString()
            const tokens = await keytokenModel.create({
                user: userId,
                publicKey: publicKeyString,
                privateKey: privateKeyString
            })
            return tokens ? { publicKeyString: tokens.publicKey, privateKeyString: tokens.privateKey } : {}
        } catch(error) {
            return error
        }
    }
}

module.exports = KeyTokenService