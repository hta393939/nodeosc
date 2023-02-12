/**
 * @file main.js
 */

const logger = require('./logger');
const Server = require('./server');
const Udp = require('./udp');
const Osc = require('./osc');

class Misc {
/**
 * マリオネット待ち受けデフォルト
 */
    static PORT_DEFAULT_MARIO = 39539;
/**
 * パフォーマー待ち受けデフォルト
 */
    static PORT_DEFAULT_PER = 39540;

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
                logger.log('receive data', obj);
            });
            udp.init({
                port: Misc.PORT_DEFAULT_MARIO,
            });
        }
        osc.init();
        server.init();
    }

    sendok() {
        const obj = {
            address: '/VMC/Ext/OK',
            values: [
                { type: 'i', value: 1 },
                { type: 'i', value: 0 },
                { type: 'i', value: 0 },
                { type: 'i', value: 1 },
            ]
        };
        const bufs = this.osc.makeOnePacket(obj);
        logger.log('sendok', bufs);
    }

}

const misc = new Misc();
misc.init();



