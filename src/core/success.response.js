'use strict'

const StatusCode = {
    OK: 200,
    CREATED: 201,
    NORESPONSE: 204,
}
const ReasonStatusCode = {
    OK: 'Success',
    CREATED: 'Created!',
    NORESPONSE: 'Server has received the request but there is no information to send back, and the client should stay in the same document view. This is mainly to allow input for scripts without changing the document at the same time.',
}

class SuccessResponse {

    constructor({ message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {} }) {
        this.message = message || reasonStatusCode
        this.status = statusCode
        this.metadata = metadata
    }

    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse {

    constructor({ message, metadata }) {
       super({ message, metadata })
    }
}

class CREATED extends SuccessResponse {

    constructor({ message, statusCode = StatusCode.CREATED, reasonStatusCode = ReasonStatusCode.CREATED, metadata, options = {} }) {
        super({ message, statusCode, reasonStatusCode, metadata })
        this.options = options;
    }
}

module.exports = {
    OK,
    CREATED
}