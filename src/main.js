/**
 * @file main.js
 */

const logger = require('./logger');
const Server = require('./server');
const Udp = require('./udp');

class Misc {
    constructor() {

    }
    init() {
        logger.log('init');
        const server = new Server();
        this.server = server;

        const udp = new Udp();
        this.udp = udp;

        const osc = new Osc();
        this.osc = osc;

        server.init();
        udp.init();
        osc.init();
    }
}

const misc = new Misc();
misc.init();



