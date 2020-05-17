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
    let userId;
    if (req.user) {
        userId = req.user.id;
    }
    Trip.find(function (err, trips) {
        if (err) {
            next(err);
        } else {
            res.status(200).send({trips: trips, userId: userId});
        }
    });
};

var getTrip = function (req, res) {
    let applied = false;
    let organizer;
    if (req.user) {
        applied = req.trip.participantIds.includes(req.user.id);
        req.trip.organizerId == (req.user.id) ? organizer = true : organizer = false;
    }
    res.status(200).json({trip: req.trip, isUserApplied: applied, isUserOrganizer: organizer});
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
                            res.status(200).json({trip: trip, isUserApplied: true, isUserOrganizer: false});
                        }
                    });
                } else {
                    res.status(400).send({ errors : "You are already on this trip!"});
                }
            }
        });
    }
};


var unsubscribeFromTrip = function (req, res, next) {
    if (!req.user) {
        res.status(401).send({ errors : "You are not logged in!"});
    } else {
        Trip.findOne({ id: req.body.tripId }, function (err, trip) {
            if (err) {
                next(err);
            } else {
                let existingIds = trip.participantIds;
                let index = existingIds.indexOf(req.user.id);
                console.log(existingIds);
                console.log(req.user.id);
                console.log(index);
                
                if (index  !== -1) {
                    existingIds.splice(index, 1);
                    Trip.findOneAndUpdate({ id: req.body.tripId }, { $set: { participantIds: existingIds } }, { new: true }, function (err, trip) {
                        if (err) {
                            next(err);
                        } else {
                            res.status(200).json({trip: trip, isUserApplied: false, isUserOrganizer: false});
                        }
                    });
                } else {
                    res.status(400).send({ errors : "You are NOT on this trip!"});
                }
            }
        });
    }
};

module.exports = {
    createTrip,
    deleteTrip,
    getAllTrips,
    getTrip,
    findTripById,
    applyToTrip,
    unsubscribeFromTrip
};