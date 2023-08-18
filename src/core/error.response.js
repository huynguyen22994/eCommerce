'use strict'

const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode')

class ErrorReponse extends Error {
    
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorReponse {

    constructor(message = ReasonPhrases.CONFLICT, status = StatusCodes.CONFLICT) {
        super(message, status)
    }
}

class BadRequestError extends ErrorReponse {

    constructor(message = ReasonPhrases.BADREQUEST, status = StatusCodes.BADREQUEST) {
        super(message, status)
    }
}

class AuthFailureError extends ErrorReponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, status = StatusCodes.UNAUTHORIZED) {
        super(message, status)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError
}