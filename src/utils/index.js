'use strict'

const _ = require('lodash')

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

module.exports = {
    getInfoData,
    typeOf,
    getSelectData,
    getUnSelectData
}