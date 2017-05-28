'use strict'

const http = require('http');
const express = require('express');
const swaggerize = require('swaggerize-express');

const port = 3001;
const host = 'localhost';

var app = express();

var server = http.createServer(app);

app.use(swaggerize({
    api: require('./docs/swagger.json'),
    docspath: '/api-docs',
    handlers: './handlers',
}));

server.listen(port, host, () => {
    app.swagger.api.host = server.address().address + ":" + server.address().port;
    console.log("API now listening on " + app.swagger.api.host);
});
