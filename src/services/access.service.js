'use strict'
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const shopModel = require('../models/shop.model')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { BadRequestError, AuthFailureError } = require('../core/error.response')
const { findByEmail } = require('../services/shop.service')
 
// Những role của shop nên dùng ký tự code chứ ko nên đặt tên giống bên dưới để phòng trường hợp dữ liệu có rò rĩ hacker cũng ko đoán được đó là role gì
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
class AccessService {

    /*
      Login
        1. check email in db
        2. match password
        3. create Access token and Refresh token and save
        4. generate tokens
        5. get data return login
    */
    static login = async ({ email, password, refreshToken = null }) => {
        // #1
        const foundShop = await findByEmail({ email })
        if(!foundShop) throw new BadRequestError('Error: Shop not found!')

        // #2
        const match = await bcrypt.compare(password, foundShop.password)
        if(!match) throw new AuthFailureError('Error: Authentication error')

        // #3 create primaryKey, publicKey -> Thuật toán bất đối xứng của crypto
        const { privateKey, publicKey } = await crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: { // Không cấu hình định dạng encode sẽ xảy ra vấn đề publicKey và privateKey là Object
                type: 'pkcs1', // => chuyển về dạng JSON để lưu key vào database
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            }
        })

        // #4 created token pair
        const { _id:userId } = foundShop;
        const publicKeyString = publicKey.toString(), privateKeyString = privateKey.toString();
        const tokens = await createTokenPair({ userId, email: foundShop.email }, publicKeyString, privateKeyString)
        await KeyTokenService.createToken({ userId, publicKey, privateKey, refreshToken: tokens.refreshToken })

        // #5
        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email', 'roles'], object: foundShop }),
            tokens
        }
    }

    static logout = async (keyStore) => {
        const delData = await KeyTokenService.removeKeyById(keyStore._id)
        return delData
    }

    static signup = async ({ name, email, password }) => {
        try {
            // step 1: check email exist
            const holderShop = await shopModel.findOne({ email }).lean()
            if(holderShop) {
                throw new BadRequestError('Error: Shop is already registered!!')
            }

            const passwordHash = await bcrypt.hash(password, 10) // Băm password để lưu vào DB. Phòng trường hợp dữ liệu rò rỉ hacker cũng không truy cập vào hệ thống được
            const newShop = await shopModel.create({
                name, password: passwordHash, email, roles: [RoleShop.SHOP]
            })

            if(newShop) {
                // create primaryKey, publicKey -> Thuật toán bất đối xứng của crypto
                const { privateKey, publicKey } = await crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: { // Không cấu hình định dạng encode sẽ xảy ra vấn đề publicKey và privateKey là Object
                        type: 'pkcs1', // => chuyển về dạng JSON để lưu key vào database
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    }
                }) // save collection KeyStore
                // => Use crypto above for level 4

                // Bên dưới là cách tạo key cơ bản
                // const privateKey = crypto.randomBytes(64).toString('hex')
                // const publicKey = crypto.randomBytes(64).toString('hex')
                // console.log( { privateKey, publicKey } )

                const { _id: userId } = newShop
                const { publicKeyString, privateKeyString } = await KeyTokenService.createToken({
                    userId,
                    publicKey,
                    privateKey
                })
                if(!publicKeyString) {
                    throw new BadRequestError('Error: PublicKeyString error')
                }
                const publicKeyObject = crypto.createPublicKey( publicKeyString ) // Đưa public key đạng JSON String từ DB thành OBJECT Key 
                console.log(`PublicKey Object:::`, publicKeyObject)

                // created token pair
                const tokens = await createTokenPair({ userId, email }, publicKeyString, privateKeyString)
                console.log(`Created Token Success::`, tokens)

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ fields: ['_id', 'name', 'email', 'roles'], object: newShop }),
                        tokens
                    }
                }
            }

            return {
                code: 200,
                metadata: null
            }

        } catch(error) {
            return {
                code: error.status,
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService