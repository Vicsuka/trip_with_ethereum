var mongoose = require('mongoose');
var validator = require('validator')

var UserSchema = new mongoose.Schema({
    auth0id: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
        lowercase: false,
        validate: (value) => {
            return validator.isAlpha(value)
        }
    },
    lastname: {
        type: String,
        required: true,
        lowercase: false,
        validate: (value) => {
            return validator.isAlpha(value)
        }
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
            return validator.isAlphanumeric(value)
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
            return validator.isEmail(value)
        }
    },
    picture: {
        type: String,
        validate: (value) => {
            return validator.isURL(value)
        }
    }
}, { timestamps: true });

UserSchema.methods.toProfileJSONFor = function (user) {
    return {
        auth0id: this.auth0id,
        firstname: this.firstname,
        lastname: this.lastname,
        username: this.username,
        email: this.email,
        picture: this.picture,
    };
};

module.exports = mongoose.model('User', UserSchema);