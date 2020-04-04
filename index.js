const express = require('express');
const mongoose = require('mongoose');
const http = require('http');

const app = express();

// Static serve
const root = require('path').join(__dirname, 'client', 'build')
app.use(express.static(root));



//Routes
app.use(require('./routes'));

// Handle other requests
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
})


const port = process.env.PORT || 5000;
app.listen(port, function () {  
    console.log("App is listening on port", port);
})


