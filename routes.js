var express = require('express');
var router = express.Router();
const fs = require('fs');

var users;

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


// Handle other requests
router.get("*", (req, res) => {
    res.sendFile('index.html', { root });
})


module.exports = router;



readJSONFile("data/users.json", function (err, json) {
  if (err) {
    throw err;
  }
  users = json;
});

function readJSONFile(filename, callback) {
  fs.readFile(filename, function (err, data) {
    if (err) {
      callback(err);
      return;
    }
    try {
      callback(null, JSON.parse(data));
    } catch (exception) {
      callback(exception);
    }
  });
}