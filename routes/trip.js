var express = require('express');
var tripUtils = require('../models/Trip/TripUtils');
var router = express.Router();

router.get('/alltrips', tripUtils.getAllTrips);
router.post('/createtrip', tripUtils.createTrip);

router.post('/apply', tripUtils.applyToTrip);
router.post('/unsubscribe', tripUtils.unsubscribeFromTrip);

router.route('/trips/:tripId')
  .get(tripUtils.getTrip)
  .delete(tripUtils.deleteTrip);
  
router.param('tripId', tripUtils.findTripById);





module.exports = router;

