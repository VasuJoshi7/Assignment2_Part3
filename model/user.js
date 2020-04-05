var mongoose = require('mongoose')
var bycrypt = require('bcrypt-nodejs')

var schema = mongoose.Schema;

var userSchema = new schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true

    },
    password: {
        type: String,
        required: true
    },
})

userSchema.methods.hashPassword = function (password) {
    return bycrypt.hashSync(password, bycrypt.genSaltSync(10))
}

userSchema.methods.comparePassword = function (password,hash) {
    return bycrypt.compareSync(password, hash)
}

module.exports = mongoose.model('users', userSchema, 'users');