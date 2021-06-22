const tcb = require('@cloudbase/node-sdk')
const userModel = require('../db/mongoose.js')
const bcrypt = require('bcrypt')
const fs = require('fs')
const formidable = require('formidable')
const os = require('os')

const app = tcb.init({
    secretId: "AKIDMUJKIlN2pOkpeJqUBaikVzpfFYaLI3zq",
    secretKey: "xe3B4g36wkHeqkY8cu88KFMDoAxVssda",
    env: 'dan-1d7bba'
})

//验证用户名是否已存在
function validateUserNameExisted(req, res, next) {
    userModel.countDocuments(req.body, (err, count) => {
        if (err) return next(err)
        res.json({ count })
    })
}

//用户注册
async function register(req, res, next) {
    let { userName, passWord } = req.body
    const saltRounds = 8
    passWord = await bcrypt.hash(passWord, saltRounds)//密码加密
    userModel.create({ userName, passWord }, (err, doc) => {
        if (err) return next(err)
        res.json(doc)
    })
}

//获取tcb自定义登录的ticket
// function getTicket(customUserId) {//customUserId至少4位！！！
//     const credentials = JSON.parse(fs.readFileSync('private/tcb_CustomLoginKeys.json').toString())
//     const app = tcb.init({
//         env: 'dan-1d7bba',
//         credentials
//     })
//     return app.auth().createTicket(customUserId)//返回ticket
// }

//用户登录
function getTicket(req, res, next) {
    const { userName, passWord } = req.body
    userModel.find({ userName }, 'passWord', async (err, docs) => {
        if (err) return next(err)
        if (docs.length === 0) return res.json({ errMsg: '用户名不存在' })

        const hash = docs[0].passWord//因为userName是唯一的，docs数组只有1个元素
        const resu = await bcrypt.compare(passWord, hash).then(res => res).catch(err => err)//比较密码
        if (resu === true) {//获取tcb自定义登录的ticket
            const credentials = JSON.parse(fs.readFileSync('private/tcb_CustomLoginKeys.json').toString())
            const app = tcb.init({
                env: 'dan-1d7bba',
                credentials
            })
            const ticket = app.auth().createTicket(userName)
            return res.json({ ticket })//返回ticket
        }
        res.json({ errMsg: '密码错误' })
    })
}

//测试响应
function tester(req, res, next) {
    res.json(req.body)
    // res.json({
    //     status: 'ok'
    // })

}

async function uploadData(req, res, next) {
    const rsl = await app.callFunction({
        name: 'uploadPadData',
        data: {
            data: req.body
        }
    }).then(res => res).catch(err => err)//必须要catch，否则err会导致挂起
    if (rsl.code) {//调用云函数异常。如果catch到err，err也有code和message字段
        const err = {
            message: rsl.message
        }
        next(err)
    }
    if (rsl.result.errMsg) {//调用云函数成功，但返回异常
        const err = {
            message: rsl.result.errMsg
        }
        next(err)
    }
    console.log(rsl.result)//打印结果，数据条数
    res.json({ status: 200 })
}

function uploadFiles(req, res, next) {
    const form = formidable({ multiples: true, uploadDir: 'C:\\temp' })
    // res.json({
    //     status: 'hello'
    // })
    // console.log(JSON.stringify(req.body))
    // res.json(req.body)
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err)
        }
        console.log(os.tmpdir())
        res.json(
            // fields,
            files
        )
    })
}

module.exports = function (app) {
    app.post('/uploadData', uploadData)
    app.post('/getTicket', getTicket)
    app.post('/register', register)
    app.post('/validateUserNameExisted', validateUserNameExisted)
    app.use('/tester', tester)//测试响应
    app.post('/uploadFiles', uploadFiles)
}