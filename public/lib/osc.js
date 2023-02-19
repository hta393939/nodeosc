/**
 * @file osc.js
 */

(function(_global) {

class Osc {
    constructor() {
    }

    init() {
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
        p.setFloat32(0, val, false); // BE
        return ab;
    }

/**
 * blob を作成する
 * @param {ArrayBuffer} val 
 * @returns {ArrayBuffer}
 */
    makeBlob(val) {
        let mod = val.byteLength % 4;
        const len = 4 + val.byteLength + mod;
        const ab = new ArrayBuffer(len);
        const p = new DataView(ab);
        p.setUint32(0, val.byteLength);
        const src = new Uint8Array(val);
        const dst = new Uint8Array(ab, 4);
        dst.copy(src, 0);
        return ab;
    }

/**
 * 
 * @param {{}} param 
 * @returns {ArrayBuffer[]}
 */
    makeOnePacket(param) {
        const bufs = [];
        bufs.push(this.makeString(param.address));
        let s = ',';
        for (const v of param.values) {
            s += v.type;
        }
        bufs.push(this.makeString(s));
        for (const v of param.values) {
            let buf = null;
            switch(v.type) {
            case 'i':
                buf = this.makeInt32(v.value);               
                break;
            case 'f':
                buf = this.makeFloat32(v.value);
                break;
            case 's':
                buf = this.makeString(v.value);
                break;
            case 'b':
                buf = this.makeBlob(v.value);
                break;
            }
            if (buf) {
                bufs.push(buf);
            }
        }
        return bufs;
    }

/**
 * バンドルとして配列を生成する
 * @param {ArrayBuffer[]} packets 
 * @returns {ArrayBuffer[]}
 */
    makeBundle(packets) {
        const bufs = [];
        bufs.push(this.makeString('#bundle'));
        for (const v of packets) {
            bufs.push(this.makeInt32(v.byteLength));
            bufs.push(v);
        }
        return bufs;
    }

/**
 * OSC文字列を読み取る
 * @param {DataView} p 
 * @param {number} offset 
 * @returns 
 */
    readString(p, offset) {
        const ret = {
            type: 's',
            value: '',
            offset: offset,
        };
        while(true) {
            let u8 = p.getUint8(ret.offset + 3);
            ret.offset += 4;
            if (u8 !== 0) {
                continue;
            }
            let mod = 0;
            for (let i = 0; i < 4; ++i) {
                u8 = p.getUint8(ret.offset + 3 - i);
                if (u8 !== 0) {
                    break;
                }
                mod += 1;
            }
            const ab = p.buffer.slice(offset, ret.offset - mod);
            try {
                ret.value = new TextDecoder().decode(ab);
            } catch(e) {
                logger.log('UTF-8 decode catch', e.message);
            }
            break;
        }
        return ret;
    }

/**
 * 
 * @param {DataView} p 
 * @param {number} offset 
 */
    readInt32(p, offset) {
        const ret = {
            type: 'i',
            value: p.getInt32(offset, false),
            offset: offset + 4,
        };
        return ret;
    }

/**
 * 
 * @param {DataView} p 
 * @param {number} offset 
 */
    readFloat32(p, offset) {
        const ret = {
            type: 'f',
            value: p.getFloat32(offset, false),
            offset: offset + 4,
        };
        return ret;
    }

    readBlob(p, offset) {
        const ret = {
            type: 'b',
        };
        let ft = offset;
        const len = p.getInt32(ft, false);
        const u8 = new Uint8Array(len);
        u8.copy(p, offset + 4);
        ret.value = u8;
        ret.offset = ft + Math.floor((offset + 4 + 3) / 4);
        return ret;
    }

/**
 * 
 * @param {DataView} p 
 * @param {number} offset p のオフセット
 */
    readOnePacket(p, offset) {
        const ret = {
            offset: offset,
            type: 'packet',
            values: [],
        };
        let cur = this.readString(p, offset);
        ret.address = cur.value;
        cur = this.readString(p, cur.offset);
        ret.argstr = cur.value;
        for (let i = 1; i < ret.argstr.length; ++i) {
            switch(ret.argstr.substring(i, i + 1)) {
            case 'f':
                cur = this.readFloat32(p, cur.offset);
                ret.values.push(cur);
                break;
            case 'i':
                cur = this.readInt32(p, cur.offset);
                ret.values.push(cur);
                break;
            case 's':
                cur = this.readString(p, cur.offset);
                ret.values.push(cur);
                break;
            case 'b':
                cur = this.readBlob(p, cur.offset);
                ret.values.push(cur);
                break;
            }
        }
        return ret;
    }

/**
 * 
 * @param {DataView} p 
 * @param {number} offset 
 */
    readOneData(p, offset) {
        let u8 = p.getUint8(offset);
        if (u8 === 0x2f) {
            // / で開始している場合は1パケット
            return [this.readOnePacket(p, offset)];
        }
        // #bundle
        const packets = [];
        let cur = this.readString(p, 0);
        while(true) {
            cur = this.readInt32(p, cur.offset);
            cur = this.readOnePacket(p, cur.offset);
            packets.push(cur);
            break;
        }
        return packets;
    }

}

if (typeof exports !== 'undefined') {
    if (typeof modules !== 'undefined') {
        exports = modules.exports = Osc;
    }
    module.exports.Osc = Osc;
} else {
    _global.Osc = Osc;
}

})( (this || 0).self || (typeof self !== 'undefined' ? self : global ));


