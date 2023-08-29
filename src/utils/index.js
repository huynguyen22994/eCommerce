'use strict'

const _ = require('lodash')
const { Types } = require('mongoose')

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

const typeOf = (value) => {
    return Object.prototype.toString.call(value).slice(8, -1)
}

// ['a', 'b'] = { a: 1, b: 1 }
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

// ['a', 'b'] = { a: 0, b: 0 }
const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedObject = (object) => {
    Object.keys(object).forEach(key => {
        if(object[key] == null || object[key] == undefined) {
            delete object[key]
        }
    })
    return object
}

const removeUndefinedDeepObject = (object) => {
    Object.keys(object).forEach(key => {
        const value = object[key]
        if(typeOf(value) === 'Object') {
            const respone = removeUndefinedDeepObject(value)
            object[key] = respone
        }
        if(object[key] == null || object[key] == undefined) {
            delete object[key]
        }
    })
    return object
}

// const a = {
//     a: 1, b: null,
//     c: {
//         d: 2, e: null,
//         f: {
//             g: 3, h: null
//         }
//     }
// }
// console.log(updateNestedObjectParser(a))
// => { a: 1, 'c.d': 2, 'c.f.g': 3 }
const updateNestedObjectParser = (object) => {
    const newObj = {}
    Object.keys(object).forEach(key => {
        const value = object[key]
        if(typeOf(value) === 'Object') {
            const respone = updateNestedObjectParser(value)
            Object.keys(respone).forEach(subKey => {
                newObj[`${key}.${subKey}`] = respone[subKey]
            })
        }
        if(object[key] && typeOf(value) !== 'Object') {
            newObj[key] = value
        }
    })
    return newObj
}

const convertToObjectIdMongo = (id) => new Types.ObjectId(id)

module.exports = {
    getInfoData,
    typeOf,
    getSelectData,
    getUnSelectData,
    removeUndefinedObject,
    removeUndefinedDeepObject,
    updateNestedObjectParser,
    convertToObjectIdMongo
}