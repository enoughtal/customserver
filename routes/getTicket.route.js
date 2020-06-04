const tcb = require('@cloudbase/node-sdk')

const app = tcb.init({
    env: 'dan-1d7bba'
})

async function getTicket(req, res, next) {
    const resu = await app.callFunction({
        name: 'getTicket',
        data: {
            customUserId: req.customUserId
        }
    })
    if (resu.code) next(resu.code)
    res.json(resu.result)
}

function testest(req, res, next) {//测试响应
    res.json(req.body)
}

module.exports = function (app) {
    app.post('/getTicket', getTicket)
    app.post('/testest', testest)//测试响应
}