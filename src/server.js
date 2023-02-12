/**
 * @file server.js
 */

const logger = require('./logger');
const http = reqiure('http');

class Server {
    constructor() {

    }
    init() {
        logger.log('init');
    }
}

module.exports = Server;


