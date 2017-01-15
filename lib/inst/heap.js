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

const utils = require("../utils.js");
const inst  = require("./inst.js");

class HeapAccess extends inst.Instruction {
    constructor(pos) {
        super(pos);
    }

    toWhitespace() {
        return utils.TAB + utils.TAB + this.toSubWhitespace();
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
        return utils.SPACE;
    }

    toUnWhitespace() {
        return "store";
    }

    doSub(vm) {
        const n   = vm.state.pop();
        const loc = vm.state.pop();
        vm.state.store(loc, n);
    }
}

class Retrieve extends HeapAccess {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return utils.TAB;
    }

    toUnWhitespace() {
        return "retrieve";
    }

    doSub(vm) {
        vm.state.push(vm.state.retrieve(vm.state.pop()));
    }
}

end();
