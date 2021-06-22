const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const fs = require('fs')

//express
const app = express()
app.use(bodyParser.json())
//CORS
app.use('*', (req, res, next) => {
    res.set('Access-Control-Allow-Origin', req.get('origin'))
    res.set("Access-Control-Allow-Headers", "Content-Type")
    res.set('Access-Control-Allow-Methods', "POST, GET, PUT, DELETE")
    next()
})
//静态路径
app.use(express.static('./public'))
//导入路由
require('./routes/user.route.js')(app)
//错误处理路由
app.use((err, req, res, next) => {
    res.json({ errMsg: err.message })
})

//使用https协议，就必须用域名调用api，用ip无效！
// const tlsOpt = {
//     pfx: fs.readFileSync('private/IIS/hugyoung.club.pfx'),
//     passphrase: 'v0dod0nf073'
// }
// const httpsServer = https.createServer(tlsOpt, app)

// const port = 443
// httpsServer.listen(port, () => { console.log(`LISTENING on port ${port}`)
// })
const port = 80
app.listen(port, () => { console.log(`LISTENING on port ${port}`) })
