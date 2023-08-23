'use strict'
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const shopModel = require('../models/shop.model')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair, verifyJWT } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response')
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
        // ở login có refreshToken là vì khi user đăng nhập lại, ae FE lấy refreshToken ở cookie dưa cho BE để BE lưu vào refreshTokenUsed -> quản lý token tốt hơn
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

    /*
      1. check this token used?
      2. if token have been used -> 
    */
    static handleRefreshToken = async (refreshToken) => {
        // check xem token nay đã được sử dụng chưa
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        // nếu có
        if(foundToken) {
            // decode xem token này là của ai lại dùng lại -> có khả năng token này bị hacker đánh cắp
            const { userId, email } = await verifyJWT(refreshToken, foundToken.publicKey)
            // xóa tất cả token của userId này trong keyStore
            await KeyTokenService.removeKeyByUserId(userId)
            throw new ForbiddenError('Error: Something wrong happend!!!')
        }
        // nếu không -> kiểm tra xem token này có đang xử dụng như refreshToken hiện tại
        // console.log(`[1]:::::`,refreshToken)
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if(!holderToken) throw new AuthFailureError('Error: Token not found')
        // verify token
        const { userId, email } = await verifyJWT(refreshToken, holderToken.publicKey)
        // check user by userId or email
        const foundShop = await findByEmail({ email })
        if(!foundShop) throw new AuthFailureError('Error: Shop by token not found')
        // create new token pair
        const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)
        // update new token for keyStore and add current token to refreshTokenUsed
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // đây là token hiện tại và được đẩy vào refreshTokenUsed vì hiện tại use dùng token mới cấp rồi
            }
        })
        return {
            user: { userId, email },
            tokens
        }
    }

    static handleRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
        const { userId, email } = user
        if(keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.removeKeyByUserId(userId)
            throw new ForbiddenError('Error: Something wrong happend!!!')
        } 
        if(keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Error: Token not found')
         // check user by userId or email
         const foundShop = await findByEmail({ email })
         if(!foundShop) throw new AuthFailureError('Error: Shop by token not found')
          // create new token pair
        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)
        // update new token for keyStore and add current token to refreshTokenUsed
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // đây là token hiện tại và được đẩy vào refreshTokenUsed vì hiện tại use dùng token mới cấp rồi
            }
        })
        return {
            user,
            tokens
        }
    }
}

module.exports = AccessService