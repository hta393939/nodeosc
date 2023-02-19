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
                // 何もしない
            }
            this[k] = val;
        }

        {
            const drop = document.querySelector('.drop');
            drop.addEventListener('dragstart', ev => {
                ev.stopPropagation();
                ev.preventDefault();
                ev.addEventListener.dropEffect = 'copy';
            });
            drop.addEventListener('drop', ev => {
                ev.stopPropagation();
                ev.preventDefault();
                this.actFiles(ev.dataTransfer.files);
            });
        }
    }

    download(blob, name) {

    }

/**
 * 
 * @param {Files} files 
 */
    async actFiles(files) {
        const num = files.length;
        const bufs = [];
        {
            const buf = new Uint8Array(6);
            const p = new DataView(buf);
            p.setUint16(0, 0);
            p.setUint16(2, 1); // 1: ico
            p.setUint16(4, num);
        }

        const images = [];
        for (const file of files) {
            const result = await this.fromFile(file);
            const buf = new Uint8Array(16);
            const p = new DataView(buf);
            result.dir = buf;
            result.p = p;
            images.push(result);
        }
        let offset = 6 + 16 * num;
        for (let i = 0; i < num; ++i) {
            const image = images[i];
            const p = image.p;
            { // 書き込む
                p.setUint8(0, image.width % 256);
                p.setUint8(1, image.height % 256);
                p.setUint8(2, 0); // 色数
                p.setUint8(3, 0); // reserved
                p.setUint16(4, 1); // カラープレーン or X
                p.setUint16(6, 32); // bit or Y
                p.setUint32(8, 0); // byte
                p.setUint32(12, 0); // ファイル内部
            }
            bufs.push(images[i].dir);
        }
        for (let i = 0; i < num; ++i) {
            bufs.push(images[i].blob);
        }
        const blob = new Blob(bufs);
        this.download(blob, `a.ico`);
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

/**
 * 
 * @param {File} file 
 */
    async fromFile(file) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.addEventListener('load', ev => {

        });
        await img.decode();
        const ret = {
            width: img.width,
            height: img.height,
            blob: file,
        };
        return ret;
    }

}

const misc = new Misc();
misc.init();


