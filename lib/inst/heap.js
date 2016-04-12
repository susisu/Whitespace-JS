/*
 * Whitespace-JS / inst/heap.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        HeapAccess,
        Store,
        Retrieve
    });
}

const inst = require("./inst.js");

class HeapAccess extends inst.Instruction {
    constructor(pos) {
        super(pos);
    }

    toWhitespace() {
        return inst.TAB + inst.TAB + this.toSubWhitespace();
    }

    toSubWhitespace() {
        throw new Error("unknown instruction");
    }
}

class Store extends HeapAccess {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return inst.SPACE;
    }

    toUnWhitespace() {
        return "store";
    }
}

class Retrieve extends HeapAccess {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return inst.TAB;
    }

    toUnWhitespace() {
        return "retrieve";
    }
}

end();
