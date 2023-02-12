/**
 * @file main.js
 */

const logger = require('./logger');
const Server = require('./server');
const Udp = require('./udp');
const Osc = require('./osc');

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

        {
            udp.on(Udp.EV_DATA, (obj) => {
                logger.log('receive data');
            });
            udp.init();
        }
        osc.init();
        server.init();
    }
}

const misc = new Misc();
misc.init();



