'use strict'

const _ = require('lodash')

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

const typeOf = (value) => {
    return Object.prototype.toString.call(value).slice(8, -1)
}

module.exports = {
    getInfoData,
    typeOf
}