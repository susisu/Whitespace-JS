/*
 * Whitespace-JS / inst/inst.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        Instruction
    });
}

const error = require("../error.js");

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

    doSub() {
        throw new Error("unknown instruction");
    }
}

end();
