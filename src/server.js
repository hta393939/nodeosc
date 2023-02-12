/**
 * @file server.js
 */

const logger = require('./logger');
const http = require('http');

class Server {
    constructor() {
        this.httpPort = 12346;
    }
    init() {
        logger.log('init', this.httpPort);
        const server = http.createServer((req, res) => {
            this.action(req, res);
        });
        this.server = server;
        server.listen(this.httpPort);
    }

    action(req, res) {
        logger.log('action');
    }
}

module.exports = Server;


