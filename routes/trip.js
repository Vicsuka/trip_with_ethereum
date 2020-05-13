var express = require('express');
var tripUtils = require('../models/Trip/TripUtils');
var router = express.Router();

// An api endpoint that returns a short list of items
router.get('', (req,res) => {
    console.log('Trip API READY');
    var trips = ["trip1", "trip2", "trip3"];
    res.json(trips);
});


router.get('/alltrips', tripUtils.getAllTrips);
router.post('/createtrip', tripUtils.createTrip);

router.post('/apply', tripUtils.applyToTrip);
router.post('/unsubscribe', tripUtils.unsubscribeFromTrip);

router.route('/trips/:tripId')
  .get(tripUtils.getTrip)
//   .put(tripUtils.updateUser)
  .delete(tripUtils.deleteTrip);
  
router.param('tripId', tripUtils.findTripById);





module.exports = router;

