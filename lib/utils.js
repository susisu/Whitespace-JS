/*
 * Whitespace-JS / utils.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        SPACE,
        TAB,
        LF,

        intToWhitespace,
        labelToWhitespace
    });
}

const SPACE = " ";
const TAB   = "\t";
const LF    = "\n";

function intToWhitespace(n) {
    n = n | 0;
    let sign;
    if (n >= 0) {
        sign = SPACE;
    }
    else {
        sign = TAB;
        n    = -n;
    }
    let bits = "";
    while (n > 0) {
        bits = ((n & 1) === 0 ? SPACE : TAB) + bits;
        n    = n >> 1;
    }
    return sign + bits + LF;
}

function labelToWhitespace(label) {
    const buf = Buffer.from(label, "utf8");
    const len = buf.length;
    let ws  = "";
    for (let offset = 0; offset < len; offset++) {
        let n = buf.readUInt8(offset);
        let c = "";
        for (let i = 0; i < 8; i++) {
            c = (n & 1 ? TAB : SPACE) + c;
            n = n >>> 1;
        }
        ws += c;
    }
    return ws + LF;
}

end();
