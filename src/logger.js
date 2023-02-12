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
        const e = new Error();
        const ss = e.stack.split('\n');
        ss.shift();
        console.log(`${_tstr()}`,
            ss[0],
            ...argv);
    }
}

const logger = new Logger();

module.exports = logger;


