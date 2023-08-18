'use strict'
const { findById } = require('../services/apiKey.service')

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if(!key) {
            res.json({
                message: 'Forbidden Error'
            })
        }
        // check objectKey
        const objectKey = await findById(key)
        if(!objectKey) {
            res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        if(objectKey) {
            req.objKey = objectKey
            return next()
        }

    } catch(error) {
        // res.status(403).json({
        //     message: error.message
        // })

    }
}

const permission = (permission) => {
    return (req, res, next) => {
        if(!req.objKey.permissions) {
            return res.status(403).json({
                message: 'permission denied'
            })
        }
        console.log(`Permission::`, req.objKey.permissions)
        const validPermission = req.objKey.permissions.includes(permission)
        if(!validPermission) {
            return res.status(403).json({
                message: 'permission denied'
            })
        }
        return next()
    }
}

const asyncHandle = (cb) => {
    return (req, res, next) => {
        cb(req, res, next).catch(next)
    }
}

module.exports = {
    apiKey,
    permission,
    asyncHandle
}