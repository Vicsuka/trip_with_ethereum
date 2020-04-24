var express = require('express');
var tripUtils = require('../models/Trip/TripUtils');
var router = express.Router();

// An api endpoint that returns a short list of items
router.get('', (req,res) => {
    console.log('Trip API READY');
    var trips = ["trip1", "trip2", "trip3"];
    res.json(trips);
});


router.post('/createTrip', tripUtils.createTrip);



module.exports = router;

