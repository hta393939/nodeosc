/**
 * @file osc.js
 */

const logger = require('./logger');

class Osc {
    constructor() {
    }

    init() {
        logger.log('init');
    }

/**
 * OSC文字列バイト列を返す
 * @param {string} s 
 * @returns {ArrayBuffer}
 */
    makeString(s) {
        const ab = new TextEncoder().encode(s);
        const len = ab.byteLength;
        let mod = 4 - len % 4;
        if (mod === 0) {
            mod = 4;
        }
        const ret = new ArrayBuffer(len + mod);
        const src = new Uint8Array(ab);
        const dst = new Uint8Array(ret);
        dst.copy(src, 0, 0);
        return ret;
    }

/**
 * 
 * @param {number} val 
 * @returns {ArrayBuffer}
 */
    makeInt32(val) {
        const ab = new ArrayBuffer(4);
        const p = new DataView(ab);
        p.setInt32(0, val, false); // BE
        return ab;
    }

/**
 * 
 * @param {number} val 
 * @returns {ArrayBuffer}
 */
    makeFloat32(val) {
        const ab = new ArrayBuffer(4);
        const p = new DataView(ab);
        p.setFloat32(0, val, false);
        return ab;
    }

/**
 * 
 * @param {ArrayBuffer} val 
 */
    makeBlob(val) {
        let mod = 4 - (val.byteLength % 4);
        if (mod === 0) {
            mod = 4;
        }
        const len = 4 + val.byteLength + mod;
        const ab = new ArrayBuffer(len);
        const p = new DataView(ab);
        p.setUint32(0, val.byteLength);
        const src = new Uint8Array(val);
        const dst = new Uint8Array(ab, 4);
        dst.copy(src, 0);
        return ab;
    }

    makeBundle() {

    }

    readString() {

    }

    readUint32() {

    }

}

module.exports = Osc;


