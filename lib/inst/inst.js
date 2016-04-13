/*
 * Whitespace-JS / inst/inst.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        SPACE,
        TAB,
        LF,

        intToWhitespace,
        Instruction
    });
}

const error = require("../error.js");

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

class Instruction {
    constructor(pos) {
        this.pos = pos;
    }

    toString() {
        return this.toUnWhitespace();
    }

    toWhitespace() {
        throw new Error("unknown instruction");
    }

    toUnWhitespace() {
        throw new Error("unknown instruction");
    }

    do(vm) {
        try {
            return this.doSub(vm);
        }
        catch (e) {
            throw new error.RuntimeError(this.pos, String(e));
        }
    }

    doSub(vm) {
        throw new Error("unknown instruction");
    }
}

end();
