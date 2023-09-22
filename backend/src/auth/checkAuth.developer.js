'use strict'

const JWT = require('jsonwebtoken')
const SECRET_KEY = 'secrect'

class DeveloperAuthentication {
    static devAccount = {
        username: 'developer',
        password: '12345'
    }

    static devAuthen = async (req, res, next) => {
        const devToken = req.session?.devToken
        if (!devToken) {
          res.writeHead(301, { "Location": "/login-api.html" });
          return res.end();
        }
        try {
          // Verify JWT token
          const decoded = await JWT.verify(devToken, SECRET_KEY)
          req.devloper = decoded
          next();
        } catch (error) {
          res.writeHead(301, { "Location": "/login-api.html" });
          return res.end();
        }
    }

    static getJWTByAccount = async ({ username, password }) => {
      return await JWT.sign({ username, password }, SECRET_KEY)
    }
}

module.exports = DeveloperAuthentication