var mongoose = require('mongoose');
var Trip = mongoose.model('Trip');

var createTrip = function (req, res, next) {
    req.body.organizerId = req.user ? req.user.id : "null";
    var trip = new Trip(req.body);
    trip.participantIds = [req.user.id];
    
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
    req.trip.remove(function (err) {
        if (err) {
            next(err);
        } else {
            res.status(200).send(req.trip);
        }
    });
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
    let applied = false;
    if (req.user) {
        applied = req.trip.participantIds.includes(req.user.id);
    }
    res.status(200).json({trip: req.trip, isUserApplied: applied});
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

var applyToTrip = function (req, res, next) {
    if (!req.user) {
        res.status(401).send({ errors : "You are not logged in!"});
    } else {
        Trip.findOne({ id: req.body.tripId }, function (err, trip) {
            if (err) {
                next(err);
            } else {
                let existingIds = trip.participantIds;
                if (existingIds.indexOf(req.user.id) === -1) {
                    existingIds.push(req.user.id);
                    Trip.findOneAndUpdate({ id: req.body.tripId }, { $set: { participantIds: existingIds } }, { new: true }, function (err, trip) {
                        if (err) {
                            next(err);
                        } else {
                            res.status(200).send(trip);
                        }
                    });
                } else {
                    res.status(400).send({ errors : "You are already on this trip!"});
                }
            }
        });
    }
    
};

module.exports = {
    createTrip,
    // updateTrip,
    deleteTrip,
    getAllTrips,
    getTrip,
    findTripById,
    applyToTrip,
    // tripExists,
    // newTrip,
    // getTripProfile,
    // updateTripProfile
};