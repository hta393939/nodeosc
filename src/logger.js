/**
 * @file logger.js
 */

const _tstr = (d = new Date()) => {
    let s = `${d.toLocaleTimeString()}`;
    return s;
};

class Logger {
    constructor() {

    }
    log(...argv) {
        console.log(`${_tstr()}`, ...argv);
    }
}

const logger = new Logger();

module.exports = logger;


