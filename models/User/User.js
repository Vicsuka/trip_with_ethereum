var mongoose = require('mongoose');
var validator = require('validator');

var UserSchema = new mongoose.Schema({
    auth0id: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
        lowercase: false
    },
    lastname: {
        type: String,
        required: true,
        lowercase: false
    },
    username: {
        type: String,
        required: false,
        unique: true
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
    },
    locale: {
        type: String,
        lowercase: true,
        validate: (value) => {
            return validator.isAlpha(value)
        }
    },
    //Not provided through auth0
    address: {
        city: {
            type: String,
            validate: (value) => {
                return validator.isAscii(value)
            }
        },
        country: {
            type: String,
            validate: (value) => {
                return validator.isAscii(value)
            }
        },
        streetAddress: {
            type: String,
            required: false,
            validate: (value) => {
                return validator.isAscii(value)
            }

        },
        postalCode: {
            type: String,
            uppercase: false,
            validate: (value) => {
                return validator.isPostalCode(value,"any")
            }

        }
    },
    about: {
        type: String,
        required: false,
        validate: (value) => {
            return validator.isAscii(value)
        }
    },
    ethereumAddress: {
        type: String,
        required: false,
        validate: (value) => {
            return validator.isEthereumAddress(value)
        }
    }

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);