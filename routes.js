var express = require('express');
var router = express.Router();
var util = require('./util.js');

var users = util.invokeJsonData();

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// An api endpoint that returns a short list of items
router.get('/api/getList', (req,res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
});

// Get user list
router.get('/api/users', (req, res) => {
    res.json(users);
});

// Get specific user
router.get('/api/user/:id', (req, res) => {
    if (req.params.id >= users.length) res.send('User not found!');

    res.json(users[req.params.id]);
});





module.exports = router;



