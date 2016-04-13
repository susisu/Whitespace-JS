/*
 * Whitespace-JS / inst/arith.js
 * copyright (c) 2016 Susisu
 */

"use strict";

function end() {
    module.exports = Object.freeze({
        Arithmetic,
        Add,
        Subtract,
        Multiple,
        Divide,
        Modulo
    });
}

const inst = require("./inst.js");

class Arithmetic extends inst.Instruction {
    constructor(pos) {
        super(pos);
    }

    toWhitespace() {
        return inst.TAB + inst.SPACE + this.toSubWhitespace();
    }

    toSubWhitespace() {
        throw new Error("unknown instruction");
    }
}

class Add extends Arithmetic {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return inst.SPACE + inst.SPACE;
    }

    toUnWhitespace() {
        return "add";
    }

    doSub(vm) {
        let b = vm.state.popStack();
        let a = vm.state.popStack();
        vm.state.pushStack((a + b) | 0);
    }
}

class Subtract extends Arithmetic {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return inst.SPACE + inst.TAB;
    }

    toUnWhitespace() {
        return "subtract";
    }

    doSub(vm) {
        let b = vm.state.popStack();
        let a = vm.state.popStack();
        vm.state.pushStack((a - b) | 0);
    }
}

class Multiple extends Arithmetic {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return inst.SPACE + inst.LF;
    }

    toUnWhitespace() {
        return "multiple";
    }

    doSub(vm) {
        let b = vm.state.popStack();
        let a = vm.state.popStack();
        vm.state.pushStack((a * b) | 0);
    }
}

class Divide extends Arithmetic {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return inst.TAB + inst.SPACE;
    }

    toUnWhitespace() {
        return "divide";
    }

    doSub(vm) {
        let b = vm.state.popStack();
        let a = vm.state.popStack();
        vm.state.pushStack((a / b) | 0);
    }
}

class Modulo extends Arithmetic {
    constructor(pos) {
        super(pos);
    }

    toSubWhitespace() {
        return inst.TAB + inst.TAB;
    }

    toUnWhitespace() {
        return "modulo";
    }

    doSub(vm) {
        let b = vm.state.popStack();
        let a = vm.state.popStack();
        vm.state.pushStack((a % b) | 0);
    }
}

end();
