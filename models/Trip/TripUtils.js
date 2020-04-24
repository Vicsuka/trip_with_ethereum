var mongoose = require('mongoose');
var Trip = mongoose.model('Trip');
var userUtils = require('../User/UserUtils');

var createTrip = function (req, res, next) {
    var trip = new Trip(req.body);
    trip.organizerId = req.user ? req.user.id : null;

    trip.save(function (err) {
        if (err) {
            next(err);
        } else {
            res.status(200).send(trip);
        }
    });
};

var updateTrip = function (req, res, next) {
    //TODO only the organizer can change the trip!
    // Trip.findByIdAndUpdate(req.body.tripId, req.body, { new: true }, function (err, trip) {
    //     if (err) {
    //         next(err);
    //     } else {
    //         res.status(200).send(trip);
    //     }
    // });
};

var deleteTrip = function (req, res, next) {
    // req.trip.remove(function (err) {
    //     if (err) {
    //         next(err);
    //     } else {
    //         res.status(200).send(req.trip);
    //     }
    // });
};

var getAllTrips = function (req, res, next) {
    Trip.find(function (err, trips) {
        if (err) {
            next(err);
        } else {
            res.status(200).send(trips);
        }
    });
};

var getTrip = function (req, res) {
    res.status(200).json(req.trip);
};

var findTripById = function (req, res, next, id) {
    Trip.findOne({ id: id }, function (err, trip) {
        if (err) {
            next(err);
        } else {
            req.trip = trip;
            next();
        }
    });
};

var getTripProfile = function (req, res, next) {
    Trip.findOne({ auth0id: req.trip.id }, function (err, trip) {
        if (err) {
            next(err);
        } else {
            res.status(200).send(trip);
        }
    });
};

var updateTripProfile = function (req, res, next) {
    Trip.findOneAndUpdate({ auth0id: req.body.auth0id }, req.body, { new: true }, function (err, trip) {
        if (err) {
            next(err);
        } else {
            res.status(200).send(trip);
        }
    });
};

module.exports = {
    createTrip,
    // updateTrip,
    // deleteTrip,
    getAllTrips,
    getTrip,
    findTripById,
    // tripExists,
    // newTrip,
    // getTripProfile,
    // updateTripProfile
};