const express = require('express');
const mongoose = require('mongoose');
const http = require('http');

const app = express();

// Static serve
const root = require('path').join(__dirname, 'client', 'build')
app.use(express.static(root));


//Routes
app.use(require('./routes'));


const port = process.env.PORT || 5000;
app.listen(port, function () {  
    console.log("App is listening on port", port);
})


