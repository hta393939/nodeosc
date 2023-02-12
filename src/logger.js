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
        ss.shift();
        let line = ss[0];
        const retop = /^\s+at/;
        const repath = new RegExp(`${__dirname}\/`);
        line = line.replace(retop, '');
        line = line.replace(repath, '');
        console.log(`${_tstr()}`,
            line,
            ...argv);
    }
}

const logger = new Logger();

module.exports = logger;


