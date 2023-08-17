const app = require("./src/app");
const config = require('./src/configs/config.mongodb')
const { port } = config.app

const PORT = port

const server = app.listen(PORT, () => {
    console.log(`WSV eComerce start with port ${ PORT }`)
})

process.on('SIGINT', () => {
    server.close(() => console.log(`Exit Server Express`))
    // notify.send(ping ...) admin use to recive notify when server down
})