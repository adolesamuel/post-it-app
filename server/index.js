var express = require('express');
var app = express();

var port = process.env.PORT || 8000;
//This starts the server=========================================
app.listen(port);
console.log('APP is running on port:' + port);