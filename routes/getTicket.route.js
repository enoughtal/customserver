// const tcb = require('@cloudbase/node-sdk')

// const app = tcb.init({
//     env: 'dan-1d7bba'
// })

// function getTicket(req, res, next) {

// }
function test(req, res, next) {
    res.json(req.body)
}

module.exports = function (app) {
    app.post('/getTicket', getTicket)
    app.post('/test', test)
}