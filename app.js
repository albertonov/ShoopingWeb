/**
* app.js
*/
// Import express module
var express = require('express');

// Import path module
var path = require('path');

// Import logger module
var logger = require('morgan');

// Instantiate the express middleware
var app = express();

// Load logger module
app.use(logger('dev'));

//Set public folder to publish static content
app.use(express.static(path.join(__dirname ,'public')));

// Adds the / path to the application
app.get('/', function (req, res) {
// Sends the Hello World string back to the client
res.send('Hello World!');
});

// Listen to port 3000
app.listen(3000, function () {
console.log('Launching...');
console.log('EasyPCy WebApp listening on port 3000!');
});

app.get(/\/.*/, function (req, res) {
    res.sendFile(path.join(__dirname ,'/public/index.html'));
  });
    