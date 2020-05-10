var mongoose = require('mongoose');
var validator = require('validator');

var TripSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
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
    // References to users
    organizerId: {
        type: String,
        required: true
    },
    participantIds: [{
        type: String,
        required: false
    }],
    //

    price: {
        type: Number,
        required: true,
        validate: (value) => {
            return value >= 0 && value < 100
        }
    },
    maxPersons: {
        type: Number,
        required: true,
        validate: (value) => {
            return value >=1 && value < 50
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
        validate: [deadLineValidator, 'Deadline must be before the starting date!']
    },
    endingDate: {
        type: String,
        required: true,
        validate: [endingDateValidator, 'Ending date must be after the starting date!']
    },
}, { timestamps: true });

function deadLineValidator(value) {
    return validator.isISO8601(value) && validator.isBefore(value,this.startingDate)
}

function endingDateValidator(value) {
    return validator.isISO8601(value) && validator.isAfter(value,this.startingDate)
}

module.exports = mongoose.model('Trip', TripSchema);