var mongoose = require('mongoose');
var validator = require('validator');

var TripSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        validate: (value) => {
            return validator.isLength(value,{min: 1, max: 30})
        }
    },
    description: {
        type: String,
        required: true,
        validate: (value) => {
            return validator.isLength(value,{min: 10, max: 500})
        }
    },
    organizerId: {
        type: String,
        required: true,
    },
    participantIds: [{
        type: String,
        required: false,
    }],
    price: {
        type: Number,
        required: true,
        validate: (value) => {
            return value >=0.0001 && value < 100;
        }
    },
    maxPersons: {
        type: Number,
        required: true,
        validate: (value) => {
            return value >=1 && value < 50;
        }
    },
    smartContractAddress: {
        type: String,
        required: false,
    },
    smartContractType: {
        type: String,
        required: true,
    },
    startingDate: {
        type: String,
        required: true,
        validate: (value) => {
            return validator.isISO8601(value)
        }
    },
    deadLineDate: {
        type: String,
        required: true,
        validate: (value) => {
            return validator.isISO8601(value) && validator.isBefore(value,startingDate)
        }
    },
    endingDate: {
        type: String,
        required: true,
        validate: (value) => {
            return validator.isISO8601(value) && validator.isAfter(value,startingDate)
        }
    },
}, { timestamps: true });

module.exports = mongoose.model('Trip', TripSchema);