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

    doSub(vm) {
        let n   = vm.state.pop();
        let loc = vm.state.pop();
        vm.state.store(loc, n);
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

    doSub(vm) {
        vm.state.push(vm.state.retrieve(vm.state.pop()));
    }
}

end();
