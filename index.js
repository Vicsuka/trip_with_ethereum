const express = require('express');
const mongoose = require('mongoose');
const http = require('http');

const app = express();

app.use(function timeLog(req, res, next) {
    // add timestamps in front of log messages
    require('console-stamp')(console, '[HH:MM:ss.l]');
    next();
  });

// Static serve
const root = require('path').join(__dirname, 'client', 'build')
app.use(express.static(root));

////////////////////////////////////////////
// Use demo data
const fs = require("fs");
var users;

// Get user list
app.get('/api/users', (req, res) => {
    res.json(users);
});

// Get specific user
app.get('/api/user/:id', (req, res) => {
    if (req.params.id >= users.length) res.send('User not found!');
    res.json(users[req.params.id]);
});

readJSONFile('data/users.json', function (err, json) {
    if (err) { throw err; }
    users = json;
});

function readJSONFile(filename, callback) {
    fs.readFile(filename, function (err, data) {
        if (err) {
            callback(err);
            return;
        }
        try {
            console.log("data loaded!");
            callback(null, JSON.parse(data));
        } catch (exception) {
            callback(exception);
        }
    });
}
////////////////////////////////////////////

//Routes
app.use('/api/test', require('./routes/test'));

// Handle other requests
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
})


const port = process.env.PORT || 5000;
app.listen(port, function () {  
    console.log("App is listening on port", port);
})


