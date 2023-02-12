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
}

const misc = new Misc();
misc.init();


