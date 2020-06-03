const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const fs = require('fs')
const path = require('path')

//express
const app = express()
app.use(bodyParser.json())
app.use('*', function (req, res, next) {
    res.set('Access-Control-Allow-Origin', req.get('origin'))
    res.set("Access-Control-Allow-Headers", "Content-Type")
    res.set('Access-Control-Allow-Methods', "POST, GET, PUT, DELETE")
    next()
})
app.use(express.static('./public'))
require('./routes/getTicket.route.js')(app)

//使用https协议
const tlsOpt = {
    pfx: fs.readFileSync(path.resolve('IIS/hugyoung.club.pfx')),//路径的最简洁写法
    passphrase: 'v0dod0nf073'
}
const httpsServer = https.createServer(tlsOpt, app)
const port = 443
httpsServer.listen(port, function () {
    console.log(`listening port ${port}`)
})
