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
        lowercase: false,
        validate: (value) => {
            return validator.isLength(value,{min: 1, max: 30})
        }
    },
    lastname: {
        type: String,
        required: true,
        lowercase: false,
        validate: (value) => {
            return validator.isLength(value,{min: 1, max: 30})
        }
    },
    username: {
        type: String,
        required: false,
        unique: true,
        validate: (value) => {
            return validator.isLength(value,{min: 1, max: 30})
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value) => {
            return validator.isEmail(value) && validator.isLength(value,{min: 1, max: 50})
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
            return validator.isAlpha(value) && validator.isLength(value,{min: 1, max: 5})
        }
    },
    //Not provided through auth0
    address: {
        city: {
            type: String,
            validate: (value) => {
                return validator.isAscii(value) && validator.isLength(value,{min: 1, max: 40})
            }
        },
        country: {
            type: String,
            validate: (value) => {
                return validator.isAscii(value) && validator.isLength(value,{min: 1, max: 40})
            }
        },
        streetAddress: {
            type: String,
            required: false,
            validate: (value) => {
                return validator.isAscii(value) && validator.isLength(value,{min: 1, max: 60})
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
            return validator.isAscii(value) && validator.isLength(value,{min: 20, max: 1000})
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