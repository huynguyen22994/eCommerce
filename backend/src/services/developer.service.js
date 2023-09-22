'use strict'

const { devAccount, getJWTByAccount } = require('../auth/checkAuth.developer')
const { BadRequestError, NotFoundError } = require('../core/error.response')

class DeveloperService {

    static async login({ username, password, page = 'apidocs' }, req, res) {
        if(devAccount.username !== username || devAccount.password !== password) {
            res.writeHead(301, { "Location": "/login-api.html" });
            return res.end();
        }

        const devToken = await getJWTByAccount({ username, password })
        req.session.devToken = devToken;
        if(page === 'graphql') {
            res.writeHead(301, { "Location": "/graphql" });
            return res.end();
        } else {
            res.writeHead(301, { "Location": "/api-docs-v1" });
            return res.end();
        }
    }

}

module.exports = DeveloperService