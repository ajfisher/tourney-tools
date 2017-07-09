'use strict'

const http = require('http');
const express = require('express');

const port = 4001;
const host = 'localhost';

var app = express();


var server = http.createServer(app);

app.use('/media', express.static('media'))

server.listen(port, host, () => {
    console.log(`Static Server now listening on ${host}:${port}`);
});

