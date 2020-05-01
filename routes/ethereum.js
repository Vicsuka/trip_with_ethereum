var express = require('express');
var router = express.Router();

// An api endpoint that returns a short list of items
router.get('', (req,res) => {
    console.log('Etereum API READY');
    var trips = ["trip1", "trip2", "trip3"];
    res.json(trips);
});




module.exports = router;

