'use strict'

const JWT = require('jsonwebtoken')
const { asyncHandle } = require('../helper/asyncHandle')
const { AuthFailureError, NotFoundError } = require('../core/error.response')

// services
const { findByUserId } = require('../services/keyToken.service')

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        })
    
        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days'
        })
    
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if(err) {
                console.error(`error verify::`, err)
            } else {
                console.log(`decode verify::`, decode)
            }
        })
    
        return { accessToken, refreshToken }
    } catch(error) {
        return error
    }
}

const authentication = asyncHandle( async (req, res, next) => {
    /*
     1. Check userId missing ???
     2. get accessToken
     3. verify Token
     4. check user in db
     5. check keyStore with this userId
     6. OK all => return next() 
    */
    // #1
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Error: Invalid Request')
    // #2
    const keyStore = await findByUserId(userId)
    if(!keyStore) throw new NotFoundError('Error: Not Found Key')
    // #3
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Error: Invalid Request')
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if(userId !== decodeUser.userId) throw new AuthFailureError('Error: Invalid UserId')
        req.keyStore = keyStore
        return next()
    } catch(error) {
        throw error
    }
} )

module.exports = {
    createTokenPair,
    authentication
}