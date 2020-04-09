var express = require('express');
var router = express.Router();

// An api endpoint that returns a short list of items
router.get('', (req,res) => {
    console.log('Testing API READY');
    var list = ["item1", "item2", "item3"];
    res.json(list);
});

module.exports = router;
