const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    pseudonyme: String,
    email: String,
    password: String,
    token: String,
    liked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'etablissements'}],
})

const User = mongoose.model('users', userSchema)

module.exports = User