'use strict'

const StatusCode = {
    NORESPONSE: 204,
    FORBIDDEN: 403,
    CONFLICT: 409,
    BADREQUEST: 400,
    UNAUTHORIZED: 401,
    NOTFOUND: 404,
    INTERNALERROR: 500,

}
const ReasonStatusCode = {
    NORESPONSE: 'Server has received the request but there is no information to send back, and the client should stay in the same document view. This is mainly to allow input for scripts without changing the document at the same time.',
    FORBIDDEN: 'The request is for something forbidden. Authorization will not help.',
    CONFLICT: 'Conflict error.',
    BADREQUEST: 'The request had bad syntax or was inherently impossible to be satisfied.',
    UNAUTHORIZED: 'The parameter to this message gives a specification of authorization schemes which are acceptable. The client should retry the request with a suitable Authorization header.',
    NOTFOUND: 'The server has not found anything matching the URI given',
    INTERNALERROR: 'The server encountered an unexpected condition which prevented it from fulfilling the request.',
}

class ErrorReponse extends Error {
    
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends ErrorReponse {

    constructor(message = ReasonStatusCode.CONFLICT, status = StatusCode.CONFLICT) {
        super(message, status)
    }
}

class BadRequestError extends ErrorReponse {

    constructor(message = ReasonStatusCode.BADREQUEST, status = StatusCode.BADREQUEST) {
        super(message, status)
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError
}