/**
 * @file main.js
 */

const logger = require('logger');
const Server = require('server');

class Misc {
    constructor() {

    }
    init() {
        logger.log('init');
        const server = new Server();
        this.server = server.init();
    }
}

const misc = new Misc();
misc.init();



