const mongoose = require('mongoose')

const dbOpt = {
    dbName: 'admin',
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongoose.connect('mongodb://localhost:27017', dbOpt)
const db = mongoose.connections[0]

db.once('connected', () => {
    console.log('SUCCESS to connect DB')
})
db.on('reconnectFailed', () => {
    process.nextTick(() => {
        console.log('FAIL RECONNECT')
    })
})

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    passWord: {
        type: String,
        required: true,
    }
})

const userModel = db.model('user', userSchema)
module.exports = userModel