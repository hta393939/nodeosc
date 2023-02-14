/**
 * @file index.js
 */

class Misc {
    constructor() {

    }
    init() {
        const params = new URLSearchParams(location.search);
        for (const k of []) {
            let val = params.get(k) ?? true;
            try {
                val = JSON.parse(val);
            } catch(ec) {

            }
            this[k] = val;
        }
    }

/**
 * 
 * @param {HTMLCanvasElement} canvas  
 * @returns {Promise<ArrayBuffer>}
 */
    toBuffer(canvas) {
        return new Promise((resolve, reject) => {
            cv.toBlob(async blob => {
                const ab = await blob.arrayBuffer();
                resolve({
                    buffer: ab,
                    width: canvas.width,
                    height: canvas.height,
                });
            }, 'image/png');
        });
    }

}

const misc = new Misc();
misc.init();


