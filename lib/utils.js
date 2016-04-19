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

        intToWhitespace
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

end();
