const mongoose = require('mongoose')

const userProSchema = mongoose.Schema({
    lastName: String,
    firstName: String,
    email: String,
    password: String,
    phoneNumber: String,
    token: String,
})

const UserPro = mongoose.model('usersPro', userProSchema)

module.exports = UserPro