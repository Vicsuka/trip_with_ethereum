const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();

var users;

// Static serve
const root = require('path').join(__dirname, 'client', 'build')
app.use(express.static(root));


// An api endpoint that returns a short list of items
app.get('/api/getList', (req,res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
});


// Get user list
app.get('/api/users', (req, res) => {
    res.json(users);
});

// Get specific user
app.get('/api/user/:id', (req, res) => {
    if (req.params.id >= users.length) res.send('User not found!');

    res.json(users[req.params.id]);
});


// Handle other requests
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
})


const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);


readJSONFile('users.json', function (err, json) {
    if(err) { throw err; }
    users = json;
  });

function readJSONFile(filename, callback) {
    fs.readFile(filename, function (err, data) {
      if(err) {
        callback(err);
        return;
      }
      try {
        callback(null, JSON.parse(data));
      } catch(exception) {
        callback(exception);
      }
    });
  }