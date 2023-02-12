/**
 * @file udp.js
 */

const logger = require('./logger');
const EventEmitter = require('events');
const dgram = require('dgram');

class Udp extends EventEmitter {
    static EV_DATA = 'data';
    static EV_ERR = 'err';
    static EV_CLOSE = 'close';
    constructor() {
        super();
    }
    init() {
        logger.log('init');
        const client = dgram.createSocket('udp4');
        this.client = client;
        this.setListener(client);
    }
    setListener(client) {
        client.on('message', (msg, rinfo) => {
            const obj = {
                message: msg,
                rinfo: rinfo,
            };
            this.emit(Udp.EV_DATA, obj);
        });
        client.on('err', (err) => {
            const obj = {
                error: err,
            };
            this.emit(Udp.EV_ERR, obj);
        });
        client.on('close', () => {
            const obj = {};
            this.emit(Udp.EV_CLOSE, obj);
        });
    }
}

module.exports = Udp;


